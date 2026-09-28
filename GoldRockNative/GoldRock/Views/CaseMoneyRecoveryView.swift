import SwiftUI
import CoreTransferable
import UniformTypeIdentifiers

private struct MoneyRecoveryEdit: Identifiable {
    let id = UUID(); let kind: String; var requestID: String?; var eventID: String?
}
struct MoneyRecoveryExport: Transferable {
    let state: CaseMoneyRecovery
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .json) { value in
            let checked = try LocalGuidance.moneyRecovery("validateMoneyRecovery", arguments: [value.state.object])
            return try JSONSerialization.data(withJSONObject: ["notice": "Historical user-recorded requests, drafts and events. Not independently verified or submitted by GoldRock. Acknowledgment is not approval; approval is not money received. Saved wording may be outdated. No automatic ledger or analysis update.", "recovery": checked.object], options: [.prettyPrinted, .sortedKeys])
        }
    }
}

struct CaseMoneyRecoveryView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @State private var editing: MoneyRecoveryEdit?
    var body: some View {
        Group {
            if let item = store.item(caseID) {
                let state = item.recovery ?? CaseMoneyRecovery()
                List {
                    Section { EditorialListHeader(eyebrow: "The money coming back", title: "Follow the request.\nKnow what arrived.", detail: "Keep provider refunds and insurance reimbursements separate—from preparation through the response and actual receipt.") }
                    Section("Start the request you intend") {
                        ChromeAction(title: "Provider refund", symbol: "arrow.uturn.backward") { editing = MoneyRecoveryEdit(kind: "refund") }
                        Button("Insurer reimbursement", systemImage: "building.2") { editing = MoneyRecoveryEdit(kind: "reimbursement") }
                        Text("A provider refund concerns money you paid a provider. An insurer reimbursement follows your plan's claim route. Neither a balance difference nor payment of a bill establishes an entitlement.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("Your local requests") {
                        ForEach(state.requests) { request in
                            NavigationLink { MoneyRecoveryRequestView(caseID: caseID, requestID: request.id) } label: {
                                VStack(alignment: .leading, spacing: 6) {
                                    Eyebrow(text: MoneyRecoveryLabels.title(request.kind)); Text(request.label).font(.headline)
                                    Text("\(request.recipientLabel) · \(request.scopeLabel)").font(.subheadline).foregroundStyle(.secondary)
                                    Text("\(request.events.count) recorded events").font(.footnote)
                                }.padding(.vertical, 6)
                            }
                        }
                        if state.requests.isEmpty { Text("Start with the recipient and service scope you checked. Requests are not created automatically from a possible credit.").foregroundStyle(.secondary) }
                    }
                    Section("Private, and in your control") {
                        Label(item.saveMode.title, systemImage: item.saveMode == .device ? "lock.iphone" : "clock")
                        Text("All details follow this case's local saving choice. GoldRock does not send requests, contact a provider or insurer, or add these records to cloud facts. Recording money here does not also add a refund in Versions & payments.").font(.footnote)
                        ShareLink(item: MoneyRecoveryExport(state: state), preview: SharePreview("Historical request records", image: Image(systemName: "doc.text"))) { Label("Export my recorded history", systemImage: "square.and.arrow.up") }
                        Text("An export makes an outside copy of potentially sensitive references and drafts. Templates in historical records may no longer be current.").font(.footnote).foregroundStyle(.secondary)
                    }
                }.goldRockScreen().navigationTitle("Refunds & reimbursement").navigationBarTitleDisplayMode(.inline)
            } else { ContentUnavailableView("Case unavailable", systemImage: "folder") }
        }.sheet(item: $editing) { MoneyRecoveryEditor(caseID: caseID, edit: $0) }
    }
}

struct MoneyRecoveryRequestView: View {
    let caseID: UUID; let requestID: String
    @Environment(AppStore.self) private var store
    @State private var editing: MoneyRecoveryEdit?
    @State private var showingGuide = false
    @State private var summary: MoneyRecoveryRequestSummary?
    @State private var summaryRevision: Date?
    @State private var problem: String?
    @State private var guidePolicy: MoneyRecoveryGuide?
    private let policyClock = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    private var request: MoneyRecoveryRequest? { store.item(caseID)?.recovery?.requests.first { $0.id == requestID } }
    private var current: MoneyRecoveryRequestSummary? { summaryRevision == store.item(caseID)?.updatedAt ? summary : nil }
    var body: some View {
        Group {
            if let request {
                List {
                    Section {
                        EditorialListHeader(eyebrow: MoneyRecoveryLabels.title(request.kind), title: request.label, detail: "\(request.recipientLabel) · \(request.scopeLabel)")
                        if !request.personLabel.isEmpty { Text("Person reference: \(request.personLabel)").font(.footnote) }
                        Text("User-recorded history, not verified by the recipient. No request is sent from this screen.").font(.footnote).foregroundStyle(.secondary)
                    }
                    if let current { summarySection(current) }
                    else if let problem { Section("Could not check the record") { Text(problem); Text("Your history is retained. No old summary is presented as current.").font(.footnote); Button("Try again") { refresh() } } }
                    Section("Keep the request moving") {
                        OperationalAction(title: "Prepare your next request", detail: "A private draft, checklist and evidence references.", symbol: "square.and.pencil") { editing = MoneyRecoveryEdit(kind: "preparation", requestID: requestID) }
                        Menu {
                            ForEach(["submitted", "acknowledged", "more_info", "decision"], id: \.self) { kind in Button(MoneyRecoveryLabels.title(kind)) { editing = MoneyRecoveryEdit(kind: kind, requestID: requestID) } }
                        } label: { EditorialFeatureRow(title: "Record a request or reply", detail: "What you sent—and what the recipient actually said.", symbol: "tray.full", showsChevron: false) }.foregroundStyle(.primary)
                        OperationalAction(title: "Record money received", detail: "Only money that actually reached you; each receipt stays separate.", symbol: "arrow.down.circle") { editing = MoneyRecoveryEdit(kind: "receipt", requestID: requestID) }
                        Button("Choose a personal follow-up date", systemImage: "calendar.badge.plus") { editing = MoneyRecoveryEdit(kind: "follow_up", requestID: requestID) }
                        Button("Read the preparation guide", systemImage: "book") { showingGuide = true }
                        Text("A request acknowledgment is not a decision. Approval, an account credit, a promised check or payment to a provider is not money actually received by you.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("History you recorded") {
                        ForEach(request.events.reversed()) { event in
                            DisclosureGroup {
                                eventDetails(event, request: request)
                                if current?.activeEventIds.contains(event.id) == true {
                                    Button("Correct this recorded event", systemImage: "pencil") { editing = MoneyRecoveryEdit(kind: event.kind, requestID: requestID, eventID: event.id) }
                                    Button("Void an incorrect entry", role: .destructive) { editing = MoneyRecoveryEdit(kind: "void", requestID: requestID, eventID: event.id) }
                                }
                            } label: {
                                VStack(alignment: .leading, spacing: 5) {
                                    Text(MoneyRecoveryLabels.title(event.kind)).font(.headline)
                                    Text(event.date ?? "Date not recorded").font(.footnote).foregroundStyle(.secondary)
                                    if current?.voidedEventIds.contains(event.id) == true { StatusPill(title: "Voided; retained as history") }
                                    else if current?.supersededEventIds.contains(event.id) == true { StatusPill(title: "Corrected; retained as history") }
                                }.padding(.vertical, 4)
                            }
                        }
                        if request.events.isEmpty { Text("Prepare a draft or record an event that actually occurred.").foregroundStyle(.secondary) }
                    }
                    Section("Manage this record") {
                        DisclosureGroup("Close or reopen tracking") {
                            Button("Close this local record", systemImage: "archivebox") { editing = MoneyRecoveryEdit(kind: "closed", requestID: requestID) }
                            Button("Reopen this local record", systemImage: "arrow.uturn.backward") { editing = MoneyRecoveryEdit(kind: "reopened", requestID: requestID) }
                            Text("This is your tracking choice, not a paid or settled finding. Personal follow-up dates do not change claim, appeal or court deadlines.").font(.footnote).foregroundStyle(.secondary)
                        }
                    }
                }.goldRockScreen().navigationTitle("Request progress").navigationBarTitleDisplayMode(.inline)
                    .sheet(isPresented: $showingGuide) { MoneyRecoveryGuideView(kind: request.kind) }
            } else { ContentUnavailableView("Request unavailable", systemImage: "doc.text") }
        }.sheet(item: $editing) { MoneyRecoveryEditor(caseID: caseID, edit: $0) }
            .onAppear { refresh() }.onChange(of: store.item(caseID)?.updatedAt) { _, _ in refresh() }
            .onReceive(policyClock) { _ in refresh() }
    }
    @ViewBuilder private func summarySection(_ result: MoneyRecoveryRequestSummary) -> some View {
        Section("What the history supports") {
            StatusPill(title: MoneyRecoveryLabels.title(result.status))
            // Populated from the shared reducer; no UI-derived financial arithmetic.
            RecordedAmount(title: "Money recorded as received by you", value: result.receivedCents.map { Money.display($0) } ?? "Not established", detail: result.receivedCents == nil ? "Missing or unknown receipts stay unknown. An approval or promised check is not a receipt." : "Total of the actual receipts you entered. Receipt history may still be incomplete.")
            Text(MoneyRecoveryLabels.title(result.receiptStatus)).font(.subheadline).foregroundStyle(.secondary)
            if result.receiptStatus == "amount_unknown" { LabeledContent("Known receipt subtotal only", value: Money.display(result.recordedReceivedCents)) }
            if let outstanding = result.unreceivedApprovedCents { LabeledContent("Approved total less recorded receipts", value: Money.display(outstanding)) }
            DisclosureGroup("Request and decision figures") {
                LabeledContent("Amount requested", value: Money.display(result.requestedCents))
                LabeledContent("Latest recorded approval", value: Money.display(result.approvedCents))
                Text("Stated payee: \(MoneyRecoveryLabels.title(result.decisionPayee ?? "unknown"))").font(.subheadline)
                Text("A historical decision remains in your record after reopening. Only a suitable current decision can be compared with known member receipts.").font(.footnote).foregroundStyle(.secondary)
            }
            ForEach(result.followUps) { reminder in Label("Personal follow-up: \(reminder.date)", systemImage: "calendar") }
            if !result.questions.isEmpty { DisclosureGroup("Questions to follow through (\(result.questions.count))") { ForEach(Array(result.questions.enumerated()), id: \.offset) { _, question in Text(question).font(.subheadline).padding(.vertical, 4) } } }
            DisclosureGroup("What this local record can establish") { Text(result.notice).font(.footnote).foregroundStyle(.secondary) }
        }
    }
    @ViewBuilder private func eventDetails(_ event: MoneyRecoveryEvent, request: MoneyRecoveryRequest) -> some View {
        if !event.reference.isEmpty { Text("Your source / receipt reference: \(event.reference)") }
        if !event.note.isEmpty { Text(event.note) }
        if event.kind == "submitted" { LabeledContent("Amount requested", value: Money.display(event.requestedCents)) }
        if event.kind == "decision" {
            if let decision = event.decision { Text(MoneyRecoveryLabels.title(decision)).font(.headline) }
            LabeledContent("Approved amount in notice", value: Money.display(event.approvedCents))
            Text("Intended payee: \(MoneyRecoveryLabels.title(event.payee ?? "unknown"))")
        }
        if event.kind == "receipt" { LabeledContent("Actual amount received by you", value: Money.display(event.receivedCents)) }
        if let preparation = event.preparation {
            Text("Saved personal preparation · historical wording, not a current determination").font(.footnote).foregroundStyle(.secondary)
            Text(preparation.draft.isEmpty ? "No draft recorded" : preparation.draft).textSelection(.enabled)
            ForEach(Array(preparation.checklist.enumerated()), id: \.offset) { _, check in Label(check.label, systemImage: check.checked ? "checkmark.circle" : "circle") }
            ForEach(Array(preparation.evidenceReferences.enumerated()), id: \.offset) { _, reference in Text("Evidence reference: \(reference)").font(.footnote) }
            if preparation.guideReceipt.isEmpty {
                ShareLink(item: preparation.draft) { Label("Share my saved personal draft", systemImage: "square.and.arrow.up") }
            } else {
                let receipts = preparation.guideReceipt.map { "\($0.id)|\($0.reviewedAt)|\($0.expiresAt)" }.sorted()
                let reviewsCurrent = guidePolicy?.current == true && guidePolicy?.receipts == receipts
                ShareLink(item: MoneyRecoveryTemplateExport(kind: request.kind, text: preparation.draft, receipts: receipts), preview: SharePreview("Reviewed saved request draft", image: Image(systemName: "doc.text"))) { Label("Share if source review is still current", systemImage: "square.and.arrow.up") }.disabled(!reviewsCurrent)
                if !reviewsCurrent { Text("Source reviews changed, expired or could not be checked. This historical draft remains readable; reopen the preparation guide before using sourced wording.").font(.footnote).foregroundStyle(.secondary) }
                Text("Original guide receipts remain with your edits. Sharing checks those reviews again; old wording stays readable here if the sources expire.").font(.footnote)
            }
        }
        Text("Recorded \(event.createdAt)").font(.caption).foregroundStyle(.secondary)
    }
    private func refresh() {
        guard let item = store.item(caseID) else { summary = nil; summaryRevision = nil; guidePolicy = nil; return }
        do {
            summary = try LocalGuidance.moneyRecoverySummary(item.recovery ?? CaseMoneyRecovery()).requests.first { $0.id == requestID }
            guidePolicy = request.flatMap { try? LocalGuidance.moneyRecoveryGuide($0.kind) }
            summaryRevision = item.updatedAt; problem = nil
        } catch { summary = nil; summaryRevision = nil; guidePolicy = nil; problem = error.localizedDescription }
    }
}

private struct RecoveryDraftCheck: Identifiable {
    let id = UUID(); var label: String; var checked: Bool
}
private struct MoneyRecoveryEditor: View {
    let caseID: UUID; let edit: MoneyRecoveryEdit
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @State private var values: [String: String] = [:]
    @State private var checks: [RecoveryDraftCheck] = []
    @State private var guideReceipt: [MoneyRecoveryPreparation.Receipt] = []
    @State private var loaded = false
    @State private var acknowledged = false
    @State private var workspace: UUID?
    @State private var active = true
    @State private var guideOpen = false
    @State private var pendingGuide: MoneyRecoveryGuide?
    @State private var replaceDraft = false
    @State private var problem: String?
    private var request: MoneyRecoveryRequest? { store.item(caseID)?.recovery?.requests.first { $0.id == edit.requestID } }
    private var isNewRequest: Bool { ["refund", "reimbursement"].contains(edit.kind) }
    private var isCurrent: Bool { active && loaded && workspace == store.workspaceIdentity && store.workspaceActive && store.item(caseID) != nil && (isNewRequest || request != nil) }
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    EditorialListHeader(eyebrow: "Private local record", title: edit.eventID == nil ? MoneyRecoveryLabels.title(edit.kind) : edit.kind == "void" ? "Void an incorrect record" : "Correct the record", detail: "Record only what you prepared or what actually happened. GoldRock does not send this request or verify the recipient's records.")
                }
                if isNewRequest { requestFields }
                else if edit.kind == "void" {
                    Section { field("note", "Why this entry was incorrect", limit: 2000, multiline: true); Toggle("Exclude this entry; retain its original history", isOn: $acknowledged); Text("Voiding corrects this local record. It does not cancel a real request, reverse money or change any deadline.").font(.footnote) }
                } else { eventFields }
                if let problem { Section { Text(problem).foregroundStyle(.red); Text("Nothing was changed. Existing request history is retained.").font(.footnote) } }
            }.goldRockScreen().navigationTitle("Request record").navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { active = false; pendingGuide = nil; dismiss() } }
                    ToolbarItem(placement: .confirmationAction) { Button("Save local record", systemImage: "checkmark") { save() }.disabled(!isCurrent || (["void", "receipt"].contains(edit.kind) && !acknowledged)) }
                }
                .onAppear { if !loaded { load() } }
                .onChange(of: scenePhase) { _, phase in if phase == .background { invalidate() } }
                .onChange(of: store.workspaceIdentity) { _, _ in invalidate() }
                .onChange(of: store.locked) { _, locked in if locked { invalidate() } }
                .onChange(of: store.item(caseID)?.id) { _, id in if id == nil { invalidate() } }
                .sheet(isPresented: $guideOpen, onDismiss: {
                    guard isCurrent, pendingGuide != nil else { return }
                    if !(values["draft"] ?? "").isEmpty || !checks.isEmpty { replaceDraft = true } else { useGuide() }
                }) {
                    if let request { MoneyRecoveryGuideView(kind: request.kind) { guide in
                        guard isCurrent else { return }; pendingGuide = guide
                    } }
                }
                .confirmationDialog("Replace this unsaved draft and checklist with a guide copy?", isPresented: $replaceDraft, titleVisibility: .visible) {
                    Button("Replace this unsaved preparation") { useGuide() }
                    Button("Keep my current draft", role: .cancel) { pendingGuide = nil }
                } message: { Text("Earlier saved preparation stays in history. Evidence references you entered stay in this form.") }
        }
    }
    private var requestFields: some View {
        Section("One recipient and service scope") {
            Text(MoneyRecoveryLabels.title(edit.kind)).font(.headline)
            field("label", "Short request label", limit: 160)
            field("recipientLabel", edit.kind == "refund" ? "Provider / billing team" : "Insurer / plan recipient", limit: 160)
            field("scopeLabel", "Service scope / short visit reference", limit: 160)
            field("personLabel", "Optional person nickname", limit: 160)
            Text("Use short references, not full identity or pasted document text. Check the recipient and scope now; these become part of the immutable request history.").font(.footnote)
        }
    }
    @ViewBuilder private var eventFields: some View {
        Section(edit.kind == "follow_up" ? "A reminder you choose" : "What you observed") {
            if edit.kind != "preparation" { field("date", edit.kind == "follow_up" ? "Personal follow-up · YYYY-MM-DD" : "Actual event date · YYYY-MM-DD", limit: 10) }
            field("reference", edit.kind == "acknowledged" ? "Acknowledgment reference / where you keep it" : "Source / confirmation reference", limit: 700, multiline: true)
            field("note", edit.eventID == nil ? "Short local note" : "Why this record needs correction", limit: 2000, multiline: true)
            if edit.kind == "follow_up" { Text("This is a personal reminder. It is not a legal deadline, filing date or extension. Correct or void it when it is no longer useful; closing this request hides its reminders from Today until reopened.").font(.footnote) }
            if edit.kind == "submitted" { moneyField("requestedCents", "Amount requested · USD or blank"); Text("Record submission only after you send the request through the correct channel. A saved draft or export does not count.").font(.footnote) }
            if edit.kind == "acknowledged" { Text("Record evidence that the recipient received your request. This is not approval and does not prove payment.").font(.footnote) }
            if edit.kind == "more_info" { Text("Use the actual request for missing information. Record its source and what is needed; independently verify any deadline in the notice.").font(.footnote) }
            if edit.kind == "decision" {
                Picker("Stated decision", selection: text("decision")) { Text("Choose the stated decision").tag(""); ForEach(["approved", "partly_approved", "denied"], id: \.self) { Text(MoneyRecoveryLabels.title($0)).tag($0) } }
                Picker("Who the notice says would be paid", selection: text("payee")) { ForEach(["unknown", "member", "provider"], id: \.self) { Text(MoneyRecoveryLabels.title($0)).tag($0) } }
                moneyField("approvedCents", "Stated approved TOTAL · USD or blank")
                Text("Enter the total stated for this whole request, not an additional installment to add to earlier decisions. If the notice states only an incremental component, leave the total blank and describe it in your note. A provider payment or approval is not money received by you.").font(.footnote)
            }
            if edit.kind == "receipt" {
                moneyField("receivedCents", "Actual amount reaching you · USD or blank")
                Toggle("I checked what actually reached me, with the reference above", isOn: $acknowledged)
                Text("Record each actual receipt separately. Blank means its amount is unknown; zero is an explicit zero amount. A promised check, credit on another account, insurer payment to a provider or approval notice is not your receipt. This does not also create a refund entry in Versions & payments.").font(.footnote)
            }
            if ["closed", "reopened"].contains(edit.kind) { Text("Record a dated reference and your reason. Closing is your organizational choice, not a finding that money is owed, paid or waived. Reopening does not extend an appeal, claim or court clock.").font(.footnote) }
        }
        if edit.kind == "preparation" {
            Section("Your editable preparation") {
                Button("Review a researched starting guide", systemImage: "book") { guideOpen = true }
                moneyField("requestedCents", "Amount you plan to request · USD or blank")
                TextEditor(text: Binding(get: { values["draft"] ?? "" }, set: { values["draft"] = String($0.prefix(12000)) })).frame(minHeight: 240).accessibilityLabel("Private request draft")
                Text("Keep sensitive identifiers in the recipient's secure form. This local draft is never submitted by GoldRock. A saved copy is historical wording, not a continuing promise that policy guidance is current.").font(.footnote)
                if !guideReceipt.isEmpty { Text("Source review receipts will be retained with this edited copy. Export of template wording requires those same reviews to remain current.").font(.footnote) }
            }
            Section("Your checklist") {
                ForEach($checks) { $check in
                    VStack(alignment: .leading) { TextField("What you need to check", text: $check.label, axis: .vertical); Toggle("Checked by me", isOn: $check.checked); Button("Remove unsaved item", role: .destructive) { checks.removeAll { $0.id == check.id } } }
                }
                Button("Add checklist item", systemImage: "plus") { checks.append(.init(label: "", checked: false)) }.disabled(checks.count >= 30)
            }
            Section("Evidence references only") {
                field("evidence", "One short reference per line; up to 20", limit: 14020, multiline: true)
                Text("Describe where you keep a receipt, statement, EOB, plan form or decision. Do not paste the original, raw OCR, names or account identifiers.").font(.footnote)
            }
        }
    }
    private func text(_ key: String) -> Binding<String> { Binding(get: { values[key] ?? "" }, set: { values[key] = $0 }) }
    private func field(_ key: String, _ title: String, limit: Int, multiline: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(title).font(.subheadline).foregroundStyle(.secondary)
            TextField(multiline ? "Add your reference or note" : "Enter a value", text: Binding(get: { values[key] ?? "" }, set: { values[key] = String($0.prefix(limit)) }), axis: multiline ? .vertical : .horizontal).lineLimit(multiline ? 3...6 : 1...1).autocorrectionDisabled(key == "date").accessibilityLabel(title)
        }.padding(.vertical, 4)
    }
    private func moneyField(_ key: String, _ title: String) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(title).font(.subheadline).foregroundStyle(.secondary)
            TextField("Leave blank if unknown", text: text(key)).font(.body.monospacedDigit()).keyboardType(.decimalPad).accessibilityLabel(title)
        }.padding(.vertical, 4)
    }
    private func invalidate() { active = false; pendingGuide = nil; guideOpen = false; replaceDraft = false }
    private func load() {
        guard store.workspaceActive, store.item(caseID) != nil, isNewRequest || request != nil else { problem = "This case or request is no longer available."; return }
        workspace = store.workspaceIdentity
        values = ["payee": "unknown"]
        if let id = edit.eventID {
            guard let event = request?.events.first(where: { $0.id == id }) else { problem = "The original event is no longer available."; return }
            if edit.kind != "void" {
                values = ["date": event.date ?? "", "reference": event.reference, "note": "", "requestedCents": ReconciliationMoney.input(event.requestedCents), "approvedCents": ReconciliationMoney.input(event.approvedCents), "receivedCents": ReconciliationMoney.input(event.receivedCents), "decision": event.decision ?? "", "payee": event.payee ?? "unknown"]
                if let preparation = event.preparation {
                    values["draft"] = preparation.draft; values["evidence"] = preparation.evidenceReferences.joined(separator: "\n")
                    checks = preparation.checklist.map { .init(label: $0.label, checked: $0.checked) }; guideReceipt = preparation.guideReceipt
                }
            }
        }
        loaded = true
    }
    private func useGuide() {
        do {
            guard isCurrent, let pending = pendingGuide else { return }
            let fresh = try LocalGuidance.moneyRecoveryGuide(pending.kind)
            guard fresh.current, fresh.receipts == pending.receipts else { throw AppError.invalid("The guide's source review changed or expired. Reopen the guide before using a copy.") }
            values["draft"] = fresh.draft; checks = fresh.checklist.map { .init(label: $0, checked: false) }
            guideReceipt = fresh.sources.map { .init(id: $0.id, reviewedAt: $0.reviewedAt, expiresAt: $0.expiresAt) }; pendingGuide = nil
        } catch { pendingGuide = nil; problem = error.localizedDescription }
    }
    private func optional(_ key: String) -> Any {
        let value = (values[key] ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        return value.isEmpty ? NSNull() : value as Any
    }
    private func amount(_ key: String) throws -> Any { if let cents = try ReconciliationMoney.parse(values[key] ?? "") { return cents }; return NSNull() }
    private func save() {
        do {
            guard isCurrent else { throw AppError.invalid("This editing session is no longer available.") }
            var fields: [String: Any] = [:]; let operation: String
            if isNewRequest {
                operation = "addRecoveryRequest"; fields = ["kind": edit.kind]
                for key in ["label", "recipientLabel", "scopeLabel", "personLabel"] { fields[key] = values[key] ?? "" }
            } else if edit.kind == "void" {
                guard acknowledged else { throw AppError.invalid("Confirm that this local entry was incorrect.") }
                operation = "voidRecoveryEvent"; fields = ["reason": values["note"] ?? ""]
            } else {
                operation = "addRecoveryEvent"; fields = ["kind": edit.kind, "date": optional("date"), "reference": values["reference"] ?? "", "note": values["note"] ?? ""]
                if let id = edit.eventID { fields["replacesId"] = id }
                switch edit.kind {
                case "submitted": fields["requestedCents"] = try amount("requestedCents")
                case "decision": fields["decision"] = values["decision"] ?? ""; fields["payee"] = values["payee"] ?? "unknown"; fields["approvedCents"] = try amount("approvedCents")
                case "receipt":
                    guard acknowledged else { throw AppError.invalid("Confirm that you checked the actual receipt.") }
                    fields["payee"] = "member"; fields["receivedCents"] = try amount("receivedCents")
                case "preparation":
                    fields["requestedCents"] = try amount("requestedCents")
                    let preparation = MoneyRecoveryPreparation(draft: values["draft"] ?? "", checklist: checks.map { .init(label: $0.label, checked: $0.checked) }, evidenceReferences: (values["evidence"] ?? "").split(separator: "\n").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }, guideReceipt: guideReceipt)
                    fields["preparation"] = try LocalGuidance.workbookObject(preparation)
                default: break
                }
            }
            try store.update(caseID) { item in
                var args: [Any] = [(item.recovery ?? CaseMoneyRecovery()).object]
                if !isNewRequest { guard let id = edit.requestID else { throw AppError.invalid("Choose the request first.") }; args.append(id) }
                if edit.kind == "void" { guard let id = edit.eventID else { throw AppError.invalid("Choose the incorrect record first.") }; args.append(id) }
                args.append(fields); args.append(LocalGuidance.moneyRecoveryOptions())
                item.recovery = try LocalGuidance.moneyRecovery(operation, arguments: args)
            }
            invalidate(); dismiss()
        } catch { problem = error.localizedDescription }
    }
}

private struct RecoveryReminder: Identifiable {
    let caseID: UUID; let requestID: String; let eventID: String; let caseTitle: String
    let requestTitle: String; let date: String; let note: String
    var id: String { caseID.uuidString + ":" + requestID + ":" + eventID }
}

/// Shared summaries supply effective reminders; no local status reducer is copied.
struct RecoveryFollowUpQueueView: View {
    var compact = false
    @Environment(AppStore.self) private var store
    @State private var reminders: [RecoveryReminder] = []
    @State private var failed = false
    @State private var today = WorkbookLabels.today()
    private let clock = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    var body: some View {
        Group {
            if compact {
                if !reminders.isEmpty || failed {
                    VStack(alignment: .leading, spacing: 12) {
                        Eyebrow(text: "Your refund & reimbursement follow-ups")
                        ForEach(Array(reminders.prefix(3))) { reminder in reminderLink(reminder) }
                        NavigationLink { RecoveryFollowUpQueueView() } label: { Label("All personal follow-ups (\(reminders.count))", systemImage: "calendar") }
                        if failed { Text("Some request reminders could not be checked. Open the case to retry; no old queue is shown as current.").font(.footnote).foregroundStyle(.secondary) }
                    }
                }
            } else {
                List {
                    Section { EditorialListHeader(eyebrow: "Your chosen reminders", title: "Keep the request moving.", detail: "Personal follow-up dates for open refund and reimbursement requests. These are not legal or filing deadlines.") }
                    Section {
                        ForEach(reminders) { reminder in reminderLink(reminder) }
                        if reminders.isEmpty { Text("No personal follow-ups are recorded for open requests.").foregroundStyle(.secondary) }
                    }
                    Section { Text("Closing a request hides its reminders here; reopening makes its remaining active reminders visible again. Correct or void a reminder in its request history when you complete or change it. No money receipt or approval closes a request automatically.").font(.footnote) }
                    if failed { Section { Text("Some request summaries could not be loaded. Existing records are retained."); Button("Check reminders again") { refresh() } } }
                }.goldRockScreen().navigationTitle("Personal follow-ups").navigationBarTitleDisplayMode(.inline)
            }
        }.onAppear { refresh() }.onChange(of: store.cases) { _, _ in refresh() }
            .onReceive(clock) { _ in today = WorkbookLabels.today() }
    }
    private func reminderLink(_ reminder: RecoveryReminder) -> some View {
        NavigationLink { MoneyRecoveryRequestView(caseID: reminder.caseID, requestID: reminder.requestID) } label: {
            VStack(alignment: .leading, spacing: 6) {
                Text(reminder.requestTitle).font(.headline)
                Text("\(reminder.caseTitle) · \(reminder.date)").font(.subheadline).foregroundStyle(.secondary)
                Text(reminder.date < today ? "Personal date you chose has passed" : reminder.date == today ? "Personal follow-up today" : "Upcoming personal follow-up").font(.footnote)
                if !reminder.note.isEmpty { Text(reminder.note).font(.footnote).lineLimit(2) }
            }.padding(.vertical, 6)
        }
    }
    private func refresh() {
        var next: [RecoveryReminder] = []; var hadError = false
        for item in store.cases {
            guard let state = item.recovery else { continue }
            do {
                for request in try LocalGuidance.moneyRecoverySummary(state).requests where request.status != "closed" {
                    next += request.followUps.map { RecoveryReminder(caseID: item.id, requestID: request.id, eventID: $0.id, caseTitle: item.title, requestTitle: request.label, date: $0.date, note: $0.note) }
                }
            } catch { hadError = true }
        }
        reminders = next.sorted { $0.date == $1.date ? $0.id < $1.id : $0.date < $1.date }; failed = hadError
    }
}
