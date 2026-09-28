import SwiftUI
import CoreTransferable
import UniformTypeIdentifiers

private struct WorkbookEdit: Identifiable {
    var id = UUID(); var kind: String; var processID: String?; var recordID: String?
}
struct WorkbookExport: Transferable {
    var workbook: CaseWorkbook
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .json) { value in
            let checked = try LocalGuidance.workbook("validateWorkbook", arguments: [try LocalGuidance.workbookObject(value.workbook)])
            let envelope: [String: Any] = ["notice": "User-recorded preparation and history, not independently verified. Sent is not received; received is not approved. Holds do not change appeal or court deadlines.", "workbook": try LocalGuidance.workbookObject(checked)]
            return try JSONSerialization.data(withJSONObject: envelope, options: [.prettyPrinted, .sortedKeys])
        }
    }
}

struct CaseWorkbookView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @State private var editing: WorkbookEdit?
    private var workbook: CaseWorkbook { store.item(caseID)?.workbook ?? CaseWorkbook() }
    var body: some View {
        List {
            Section {
                EditorialListHeader(eyebrow: "Your follow-through", title: "Make progress.\nKeep your place.", detail: "One case can have several processes. Keep each request, its evidence and what happens next together.")
                Text("All records here are entered by you and stay with this local case. No originals or raw OCR are stored. Nothing is submitted automatically.").font(.footnote).foregroundStyle(.secondary)
            }
            Section("Processes") {
                ChromeAction(title: "Start a process", symbol: "plus") { editing = WorkbookEdit(kind: "Process") }
                ForEach(workbook.processes) { process in
                    NavigationLink { WorkbookProcessView(caseID: caseID, processID: process.id) } label: {
                        VStack(alignment: .leading, spacing: 9) { Eyebrow(text: WorkbookLabels.title(process.kind)); Text(process.title).font(.headline); StatusPill(title: WorkbookLabels.title(process.status)); Text("\(process.criteria.count) criteria · \(process.deadlines.count) dates · \(process.communications.count) communications").font(.footnote).foregroundStyle(.secondary) }.padding(.vertical, 6)
                    }
                }
                if workbook.processes.isEmpty { Text("Start with the process you are actually pursuing. GoldRock does not infer that you filed an appeal or received a collection notice.").foregroundStyle(.secondary) }
            }
            Section("Evidence references") {
                NavigationLink { WorkbookEvidenceView(caseID: caseID) } label: { EditorialFeatureRow(title: "Your evidence, connected.", detail: "Manage \(workbook.evidence.count) local references and link them to what needs to be shown.", symbol: "doc.text.magnifyingglass", showsChevron: false) }
                Text("Record a label and where you keep the document. Link the reference to the criteria it supports. GoldRock does not verify the evidence or keep the original.").font(.footnote).foregroundStyle(.secondary)
            }
            Section("Dates across processes") {
                Text("A requested or confirmed billing/collection hold does not change an appeal, dispute or court deadline.").font(.headline)
                ForEach(workbook.processes) { process in
                    ForEach(process.deadlines.sorted { $0.date < $1.date }) { date in
                        VStack(alignment: .leading, spacing: 5) {
                            Text("\(date.date) · \(date.title)")
                            Text("\(process.title) · \(date.kind == "follow_up" ? "Chosen reminder" : date.confirmed ? "Date you confirmed" : "Date to verify")\(["resolved", "closed"].contains(process.status) ? " · Closed process history" : "")").font(.footnote).foregroundStyle(.secondary)
                            if date.date < WorkbookLabels.today() { Text("This recorded date is in the past. Check the actual notice and available next steps.").font(.footnote) }
                        }.padding(.vertical, 4)
                    }
                }
            }
            Section("Saving and export") {
                Text(store.item(caseID)?.saveMode == .device ? "Saved with this case in the protected device vault." : "One-time case: records stay in process memory until you keep this case on your iPhone.")
                ShareLink(item: WorkbookExport(workbook: workbook), preview: SharePreview("Private case workbook", image: Image(systemName: "list.bullet.clipboard"))) { Label("Export my recorded workbook", systemImage: "square.and.arrow.up") }
                Text("Notes can contain sensitive details. Export creates a copy outside GoldRock. A recorded event is not independently verified.").font(.footnote).foregroundStyle(.secondary)
            }
        }.goldRockScreen().navigationTitle("Case workbook").navigationBarTitleDisplayMode(.inline)
            .sheet(item: $editing) { editor in WorkbookEditor(caseID: caseID, edit: editor) }
    }
}

private struct WorkbookEvidenceView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @State private var editing: WorkbookEdit?
    @State private var deleting: WorkbookEvidence?
    var body: some View {
        List {
            Section { EditorialListHeader(eyebrow: "The pieces that support your request", title: "Know what you have.\nSee what is missing.", detail: "Keep originals in a place you control. Add a reference here and connect it to the requirement it supports."); Button("Add evidence reference", systemImage: "plus") { editing = WorkbookEdit(kind: "Evidence") } }
            ForEach(store.item(caseID)?.workbook?.evidence ?? []) { evidence in
                Button { editing = WorkbookEdit(kind: "Evidence", recordID: evidence.id) } label: {
                    VStack(alignment: .leading, spacing: 6) { Text(evidence.label).font(.headline); Text(WorkbookLabels.title(evidence.kind)); if !evidence.locator.isEmpty { Text(evidence.locator).foregroundStyle(.secondary) }; if !evidence.note.isEmpty { Text(evidence.note).font(.footnote) } }
                }.buttonStyle(.plain).swipeActions { Button("Delete", role: .destructive) { deleting = evidence } }
            }
        }.goldRockScreen().navigationTitle("Evidence references").navigationBarTitleDisplayMode(.inline)
            .sheet(item: $editing) { WorkbookEditor(caseID: caseID, edit: $0) }
            .confirmationDialog("Delete this evidence reference?", isPresented: Binding(get: { deleting != nil }, set: { if !$0 { deleting = nil } }), titleVisibility: .visible) {
                Button("Delete reference", role: .destructive) { if let deleting { WorkbookMutations.remove(store, caseID: caseID, kind: "Evidence", processID: nil, recordID: deleting.id) }; deleting = nil }
            } message: { Text("Remove any criterion links first. Your original document is not affected.") }
    }
}

private struct WorkbookProcessView: View {
    let caseID: UUID; let processID: String
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var editing: WorkbookEdit?
    @State private var deleting: WorkbookEdit?
    private var process: WorkbookProcess? { store.item(caseID)?.workbook?.processes.first { $0.id == processID } }
    var body: some View {
        Group {
            if let process {
                List {
                    Section {
                        EditorialListHeader(eyebrow: WorkbookLabels.title(process.kind), title: process.title, detail: "Keep the requirements, records and next dates for this process together.")
                        StatusPill(title: WorkbookLabels.title(process.status))
                        if !process.notes.isEmpty { Text(process.notes) }
                        Button("Edit process or record outcome") { edit("Process", process.id) }
                        if let outcome = process.outcome { Text("\(WorkbookLabels.title(outcome.decision)) · \(outcome.date)\nSource you recorded: \(outcome.sourceLabel)\n\(outcome.note)").font(.footnote) }
                    }
                    Section("Evidence to criteria") {
                        Button("Add a criterion", systemImage: "plus") { edit("Criterion") }
                        ForEach(process.criteria) { row in
                            recordButton("Criterion", row.id, title: row.requirement, detail: "\(WorkbookLabels.title(row.assessment)) · \(row.evidenceIds.count) linked references\n\(row.sourceLabel)\n\(row.note)")
                        }
                    }
                    Section("Dates to protect") {
                        Text("Confirm dates from the actual notice or process. A follow-up reminder is your own chosen date.").font(.footnote).foregroundStyle(.secondary)
                        Button("Add date or reminder", systemImage: "plus") { edit("Deadline") }
                        ForEach(process.deadlines) { row in recordButton("Deadline", row.id, title: "\(row.date) · \(row.title)", detail: "\(row.kind == "follow_up" ? "Chosen reminder" : row.confirmed ? "User-confirmed date" : "Unverified date")\n\(row.sourceLabel)\n\(row.note)") }
                    }
                    Section("Communication and receipts") {
                        Text("Sent is not received. Received is not approved. Record dates and acknowledgements only when they actually happened.").font(.footnote).foregroundStyle(.secondary)
                        Button("Record communication", systemImage: "plus") { edit("Communication") }
                        ForEach(process.communications) { row in recordButton("Communication", row.id, title: row.subject, detail: "\(WorkbookLabels.title(row.direction)) · \(row.recipient)\nSent: \(row.sentAt ?? "Not recorded") · Received: \(row.receivedAt ?? "Not recorded")\n\(row.receiptReference)\n\(row.note)") }
                    }
                    Section("Billing and collection holds") {
                        Text("A hold has a specific scope and may have an end date. It does not stop an appeal or court clock.").font(.headline)
                        Button("Record a hold request or response", systemImage: "plus") { edit("Hold") }
                        ForEach(process.holds) { row in recordButton("Hold", row.id, title: "\(WorkbookLabels.title(row.scope)) · \(WorkbookLabels.title(row.status))", detail: "Requested: \(row.requestedAt ?? "Not recorded")\nConfirmed: \(row.confirmedAt ?? "Not recorded") · Through: \(row.throughDate ?? "Not recorded")\n\(row.confirmedBy) · \(row.reference)\n\(row.throughDate.map { $0 < WorkbookLabels.today() ? "Recorded end date has passed. Recheck the actual status." : "" } ?? "")\n\(row.note)") }
                    }
                    Section { Button("Delete this process and its records", role: .destructive) { deleting = WorkbookEdit(kind: "Process", processID: processID, recordID: processID) } }
                }.goldRockScreen().navigationTitle(process.title).navigationBarTitleDisplayMode(.inline)
            } else { ContentUnavailableView("Process unavailable", systemImage: "list.bullet.clipboard", description: Text("The process or local case may have been removed.")) }
        }.sheet(item: $editing) { WorkbookEditor(caseID: caseID, edit: $0) }
            .confirmationDialog("Delete this local record?", isPresented: Binding(get: { deleting != nil }, set: { if !$0 { deleting = nil } }), titleVisibility: .visible) {
                Button("Delete record", role: .destructive) { if let deleting { let removed = WorkbookMutations.remove(store, caseID: caseID, kind: deleting.kind, processID: processID, recordID: deleting.recordID!); if removed && deleting.kind == "Process" { dismiss() } }; deleting = nil }
            } message: { Text("Deleting a process also deletes its criteria, dates, communications and hold history. Evidence references and original documents remain.") }
    }
    private func edit(_ kind: String, _ recordID: String? = nil) { editing = WorkbookEdit(kind: kind, processID: processID, recordID: recordID) }
    private func recordButton(_ kind: String, _ id: String, title: String, detail: String) -> some View {
        Button { edit(kind, id) } label: { VStack(alignment: .leading, spacing: 6) { Text(title).font(.headline); Text(detail).font(.body).foregroundStyle(.secondary).lineLimit(4); Text("Review or edit").font(.footnote.weight(.medium)).foregroundStyle(GoldRockTheme.accent) }.padding(.vertical, 5) }.buttonStyle(.plain)
            .swipeActions { Button("Delete", role: .destructive) { deleting = WorkbookEdit(kind: kind, processID: processID, recordID: id) } }
    }
}

@MainActor private enum WorkbookMutations {
    @discardableResult static func remove(_ store: AppStore, caseID: UUID, kind: String, processID: String?, recordID: String) -> Bool {
        do {
            try store.update(caseID) { item in
                var args: [Any] = [try LocalGuidance.workbookObject(item.workbook ?? CaseWorkbook())]
                if kind != "Process" && kind != "Evidence" { guard let processID else { throw AppError.invalid("Choose a process first.") }; args.append(processID) }
                args.append(recordID); if kind != "Process" { args.append(LocalGuidance.workbookOptions()) }
                item.workbook = try LocalGuidance.workbook("remove" + kind, arguments: args)
            }; return true
        } catch { store.error = error.localizedDescription; return false }
    }
}

private struct WorkbookEditor: View {
    let caseID: UUID; let edit: WorkbookEdit
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var values: [String: String] = [:]
    @State private var linked: Set<String> = []
    @State private var confirmed = false
    @State private var hasOutcome = false
    @State private var problem: String?
    var body: some View {
        NavigationStack {
            Form {
                Section { EditorialListHeader(eyebrow: "A record you control", title: editorTitle, detail: "Enter what actually happened and the source you checked. These details stay in your local case.") }
                editorFields
                if let problem { Section { Text(problem).foregroundStyle(.red) } }
            }.goldRockScreen().navigationTitle((edit.recordID == nil ? "Add " : "Edit ") + edit.kind.lowercased()).navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } }
                    ToolbarItem(placement: .confirmationAction) { Button("Save local record", systemImage: "checkmark") { save() } }
                }.onAppear { load() }
        }
    }
    private var editorTitle: String {
        switch edit.kind { case "Process": "Give the next step\na place to live."; case "Evidence": "Leave yourself\na clear reference."; case "Criterion": "What needs\nto be shown?"; case "Deadline": "Keep the right\ndate in view."; case "Communication": "Keep the receipt.\nRecord the response."; case "Hold": "What was actually\nput on hold?"; default: "Keep the details together." }
    }
    @ViewBuilder private var editorFields: some View {
        switch edit.kind {
        case "Process": processFields
        case "Evidence": Section { field("label", "Evidence label"); choice("kind", "Document kind", WorkbookLabels.evidence); field("locator", "Where you keep it / page reference"); field("note", "Reference notes", multiline: true) }
        case "Criterion": criterionFields
        case "Deadline": Section { field("title", "Date label"); choice("kind", "Date kind", WorkbookLabels.deadlines); field("date", "Date · YYYY-MM-DD"); Toggle("I confirmed this date from its source", isOn: $confirmed).disabled(values["kind"] == "follow_up"); field("sourceLabel", "Notice or source used to confirm"); field("note", "Notes", multiline: true); Text("A chosen follow-up is not a legal deadline. Do not assume a billing hold pauses this date.").font(.footnote) }.onChange(of: values["kind"]) { _, kind in if kind == "follow_up" { confirmed = false } }
        case "Communication": communicationFields
        case "Hold": holdFields
        default: Section { Text("This record type is unavailable.") }
        }
    }
    private var processFields: some View {
        Group {
            Section { field("title", "Process name"); if edit.recordID == nil { choice("kind", "Process kind", WorkbookLabels.processes) } else { choice("status", "State you recorded", WorkbookLabels.statuses) }; field("notes", "Private process notes", multiline: true) }
            if edit.recordID != nil {
                Section("Actual outcome") {
                    Toggle("Record an outcome and its source", isOn: $hasOutcome)
                    if hasOutcome { choice("decision", "Recorded decision", WorkbookLabels.outcomes); field("outcomeDate", "Decision date · YYYY-MM-DD"); field("outcomeSource", "Written decision / other source"); field("outcomeNote", "What the outcome actually covers", multiline: true) }
                    Text("Resolved requires a recorded outcome. Closed can mean you stopped this process and does not imply approval.").font(.footnote)
                }
            }
        }
    }
    private var criterionFields: some View {
        Group {
            Section { field("requirement", "What must be shown", multiline: true); field("sourceLabel", "Policy, notice or requirement source"); choice("assessment", "Your assessment", WorkbookLabels.assessments); field("note", "Why / what is missing", multiline: true) }
            Section("Link your evidence references") {
                ForEach(store.item(caseID)?.workbook?.evidence ?? []) { evidence in Toggle(evidence.label, isOn: Binding(get: { linked.contains(evidence.id) }, set: { if $0 { linked.insert(evidence.id) } else { linked.remove(evidence.id) } })) }
                Text("Supported requires at least one linked reference. It means your assessment, not GoldRock verification. Add references from the case workbook first.").font(.footnote).foregroundStyle(.secondary)
            }
        }
    }
    private var communicationFields: some View {
        Section {
            choice("direction", "Direction", ["outgoing", "incoming"]); choice("channel", "Channel", WorkbookLabels.channels)
            field("recipient", "Recipient / receiving office"); field("subject", "Subject")
            field("sentAt", "Actually sent · YYYY-MM-DD or blank"); field("receivedAt", "Actually received · YYYY-MM-DD or blank")
            field("receiptReference", "Receipt / acknowledgement reference", multiline: true); field("note", "Response and next step", multiline: true)
            Text("Keep blank if you have no evidence it happened. Receipt needs an acknowledgement reference; it does not mean acceptance or approval.").font(.footnote)
        }
    }
    private var holdFields: some View {
        Section {
            choice("scope", "Scope", ["billing", "collections", "both", "other"]); choice("status", "State you recorded", WorkbookLabels.holds)
            field("requestedAt", "Actually requested · YYYY-MM-DD or blank"); field("confirmedAt", "Actually confirmed · YYYY-MM-DD or blank")
            field("throughDate", "Confirmed end · YYYY-MM-DD or blank"); field("confirmedBy", "Who confirmed it"); field("reference", "Confirmation reference", multiline: true); field("note", "Exact scope and conditions", multiline: true)
            Text("Only select confirmed after confirmation. No end date means it is not recorded, not an indefinite hold. A hold does not change appeal, dispute or court deadlines.").font(.footnote)
        }
    }
    private func field(_ key: String, _ title: String, multiline: Bool = false) -> some View {
        TextField(title, text: Binding(get: { values[key] ?? "" }, set: { values[key] = $0 }), axis: multiline ? .vertical : .horizontal).lineLimit(multiline ? 3...8 : 1...1).autocorrectionDisabled(key.lowercased().contains("date") || key.hasSuffix("At"))
    }
    private func choice(_ key: String, _ title: String, _ options: [String]) -> some View {
        Picker(title, selection: Binding(get: { values[key] ?? options[0] }, set: { values[key] = $0 })) { ForEach(options, id: \.self) { Text(WorkbookLabels.title($0)).tag($0) } }
    }
    private func load() {
        guard values.isEmpty else { return }
        let workbook = store.item(caseID)?.workbook ?? CaseWorkbook()
        let process = workbook.processes.first { $0.id == edit.processID }
        do {
            var raw: Any?
            if let recordID = edit.recordID {
                switch edit.kind {
                case "Process": if let value = process { raw = try LocalGuidance.workbookObject(value) }
                case "Evidence": if let value = workbook.evidence.first(where: { $0.id == recordID }) { raw = try LocalGuidance.workbookObject(value) }
                case "Criterion": if let value = process?.criteria.first(where: { $0.id == recordID }) { raw = try LocalGuidance.workbookObject(value); linked = Set(value.evidenceIds) }
                case "Deadline": if let value = process?.deadlines.first(where: { $0.id == recordID }) { raw = try LocalGuidance.workbookObject(value); confirmed = value.confirmed }
                case "Communication": if let value = process?.communications.first(where: { $0.id == recordID }) { raw = try LocalGuidance.workbookObject(value) }
                case "Hold": if let value = process?.holds.first(where: { $0.id == recordID }) { raw = try LocalGuidance.workbookObject(value) }
                default: break
                }
                guard let dictionary = raw as? [String: Any] else { throw AppError.invalid("The record was removed. Close this editor and return to the current workbook.") }
                values = dictionary.compactMapValues { $0 as? String }
                if let outcome = process?.outcome, edit.kind == "Process" { hasOutcome = true; values["decision"] = outcome.decision; values["outcomeDate"] = outcome.date; values["outcomeSource"] = outcome.sourceLabel; values["outcomeNote"] = outcome.note }
            } else {
                values = ["kind": edit.kind == "Process" ? "appeal" : edit.kind == "Evidence" ? "other" : "follow_up", "status": edit.kind == "Hold" ? "requested" : "preparing", "assessment": "unknown", "direction": "outgoing", "channel": "other", "scope": "billing", "decision": "resolved_other"]
            }
        } catch { problem = error.localizedDescription }
    }
    private func fields() -> [String: Any] {
        func text(_ key: String) -> String { values[key] ?? "" }
        func date(_ key: String) -> Any { if text(key).isEmpty { return NSNull() }; return text(key) }
        switch edit.kind {
        case "Process":
            if edit.recordID == nil { return ["kind": text("kind"), "title": text("title"), "notes": text("notes")] }
            let outcome: Any = hasOutcome ? ["decision": text("decision"), "date": text("outcomeDate"), "sourceLabel": text("outcomeSource"), "note": text("outcomeNote")] as Any : NSNull()
            return ["title": text("title"), "status": text("status"), "notes": text("notes"), "outcome": outcome]
        case "Evidence": return ["label": text("label"), "kind": text("kind"), "locator": text("locator"), "note": text("note")]
        case "Criterion": return ["requirement": text("requirement"), "sourceLabel": text("sourceLabel"), "assessment": text("assessment"), "evidenceIds": linked.sorted(), "note": text("note")]
        case "Deadline": return ["title": text("title"), "date": text("date"), "kind": text("kind"), "confirmed": confirmed, "sourceLabel": text("sourceLabel"), "note": text("note")]
        case "Communication": return ["direction": text("direction"), "channel": text("channel"), "recipient": text("recipient"), "subject": text("subject"), "sentAt": date("sentAt"), "receivedAt": date("receivedAt"), "receiptReference": text("receiptReference"), "note": text("note")]
        case "Hold": return ["scope": text("scope"), "status": text("status"), "requestedAt": date("requestedAt"), "confirmedAt": date("confirmedAt"), "throughDate": date("throughDate"), "confirmedBy": text("confirmedBy"), "reference": text("reference"), "note": text("note")]
        default: return [:]
        }
    }
    private func save() {
        do {
            let patch = fields()
            try store.update(caseID) { item in
                var args: [Any] = [try LocalGuidance.workbookObject(item.workbook ?? CaseWorkbook())]
                if edit.kind != "Process" && edit.kind != "Evidence" { guard let processID = edit.processID else { throw AppError.invalid("Choose a process first.") }; args.append(processID) }
                if let recordID = edit.recordID { args.append(recordID) }
                args.append(patch); args.append(LocalGuidance.workbookOptions())
                item.workbook = try LocalGuidance.workbook((edit.recordID == nil ? "add" : "update") + edit.kind, arguments: args)
            }; dismiss()
        } catch { problem = error.localizedDescription }
    }
}
