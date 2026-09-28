import SwiftUI
import CoreTransferable
import UniformTypeIdentifiers
import VisionKit
import AVFoundation

private struct ReconciliationEdit: Identifiable {
    let id = UUID(); let kind: String; var groupID: String?; var recordID: String?
}
struct ReconciliationExport: Transferable {
    let state: CaseReconciliation
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .json) { value in
            let checked = try LocalGuidance.reconciliation("validateReconciliation", arguments: [value.state.object])
            let notice = "User-recorded versions and payment history. Calculated differences are questions, not verified debt, savings or refunds. Original documents are not included. Analysis facts were not changed by this workspace."
            return try JSONSerialization.data(withJSONObject: ["notice": notice, "reconciliation": checked.object], options: [.prettyPrinted, .sortedKeys])
        }
    }
}

struct CaseReconciliationView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @State private var editing: ReconciliationEdit?
    @State private var reviewingFacts = false
    var body: some View {
        Group {
            if let item = store.item(caseID) {
                let state = item.reconciliation ?? CaseReconciliation()
                List {
                    Section {
                        EditorialListHeader(eyebrow: "Your numbers, in context", title: "Compare the records.\nKeep every version.", detail: "Bring bills, insurance decisions and payment receipts together—one biller and service group at a time.")
                        Text("Enter short references and reviewed figures. Original documents and raw extracted text are not stored here. These records stay on this device.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("Separate billers and services") {
                        ChromeAction(title: "Add a biller / service group", symbol: "plus") { editing = ReconciliationEdit(kind: "group") }
                        ForEach(state.groups) { group in
                            NavigationLink { ReconciliationGroupView(caseID: caseID, groupID: group.id) } label: {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(group.label).font(.headline)
                                    Text("\(group.billerLabel) · \(group.serviceLabel)").font(.subheadline).foregroundStyle(.secondary)
                                    if !group.personLabel.isEmpty { Text(group.personLabel).font(.footnote) }
                                    Text("\(group.documents.count) document versions · \(group.payments.count) payment-history records").font(.footnote).foregroundStyle(.secondary)
                                }.padding(.vertical, 6)
                            }
                        }
                        if state.groups.isEmpty { Text("Keep the hospital, physician, lab and other billers separate. Split different people or service scopes into separate groups; the app will not decide which documents match.").foregroundStyle(.secondary) }
                    }
                    Section("Separate from analysis") {
                        Text("Choosing a revised bill or EOB here does not update your analysis facts or a previous cloud result. Review those facts separately before requesting new guidance.")
                        Button("Review analysis facts", systemImage: "slider.horizontal.3") { reviewingFacts = true }
                    }
                    Section("Saving and export") {
                        Label(item.saveMode.title, systemImage: item.saveMode == .device ? "lock.iphone" : "clock")
                        Text("Versions, references and payment notes follow this case's saving choice. They are never added to the cloud-analysis payload.").font(.footnote).foregroundStyle(.secondary)
                        ShareLink(item: ReconciliationExport(state: state), preview: SharePreview("Private reconciliation history", image: Image(systemName: "doc.on.doc"))) { Label("Export my recorded history", systemImage: "square.and.arrow.up") }
                        Text("Export creates a copy in the destination you choose. References and notes may be sensitive. Delete the case to remove this entire local history.").font(.footnote).foregroundStyle(.secondary)
                    }
                }.goldRockScreen().navigationTitle("Versions & payments").navigationBarTitleDisplayMode(.inline)
                    .sheet(isPresented: $reviewingFacts) { EditFactsView(caseID: caseID, initial: item.facts) }
            } else { ContentUnavailableView("Case unavailable", systemImage: "folder") }
        }.sheet(item: $editing) { ReconciliationEditor(caseID: caseID, edit: $0) }
    }
}

private struct ReconciliationGroupView: View {
    let caseID: UUID; let groupID: String
    @Environment(AppStore.self) private var store
    @State private var editing: ReconciliationEdit?
    @State private var summary: ReconciledGroup?
    @State private var summaryRevision: Date?
    @State private var problem: String?
    private var group: ReconciliationGroup? { store.item(caseID)?.reconciliation?.groups.first { $0.id == groupID } }
    private var currentSummary: ReconciledGroup? { summaryRevision == store.item(caseID)?.updatedAt ? summary : nil }
    var body: some View {
        Group {
            if let group {
                List {
                    Section {
                        EditorialListHeader(eyebrow: "One biller. One service scope.", title: group.label, detail: "\(group.billerLabel) · \(group.serviceLabel)")
                        if !group.personLabel.isEmpty { Text("Person reference: \(group.personLabel)").font(.footnote) }
                        Text("The figures and matching choices are recorded by you, not verified with the biller or insurer.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("Your next comparison") {
                        ChromeAction(title: "Choose versions & review payments", symbol: "checkmark.rectangle.stack") { editing = ReconciliationEdit(kind: "selection", groupID: groupID) }
                        Text("Choose only records for this biller and service scope. New versions are never selected for you.").font(.footnote).foregroundStyle(.secondary)
                    }
                    if let problem {
                        Section("Could not refresh the comparison") { Text(problem); Text("Existing history is retained. No previous result is presented as current.").font(.footnote); Button("Try local check again") { refresh() } }
                    } else if let currentSummary { comparison(currentSummary) }
                    else { Section { ProgressView("Checking recorded figures…") } }
                    Section("Documents and versions") {
                        OperationalAction(title: "Add a document version", detail: "Scan, import or enter a bill, EOB or estimate.", symbol: "doc.badge.plus") { editing = ReconciliationEdit(kind: "document", groupID: groupID) }
                        if group.documents.isEmpty { Text("Keep the first version here, then append corrections as they arrive. You can still see every earlier record.").font(.subheadline).foregroundStyle(.secondary) }
                        ForEach(group.documents.reversed()) { document in
                            DisclosureGroup {
                                documentDetails(document)
                                Button("Add a corrected / revised version", systemImage: "doc.on.doc") { editing = ReconciliationEdit(kind: "document", groupID: groupID, recordID: document.id) }
                            } label: {
                                VStack(alignment: .leading, spacing: 5) {
                                    Text(document.label).font(.headline)
                                    Text("\(ReconciliationLabels.kind(document.kind)) · \(document.documentDate ?? "Date not recorded")").font(.footnote).foregroundStyle(.secondary)
                                    if isSelected(document.id, group: group) { StatusPill(title: "Chosen in last review", symbol: "checkmark") }
                                    if document.revisionOfId != nil { Text("Revision; earlier version retained").font(.footnote) }
                                }.padding(.vertical, 4)
                            }
                        }
                    }
                    Section("Payments and refunds you record") {
                        OperationalAction(title: "Record money that moved", detail: "A payment you made or a refund you actually received.", symbol: "arrow.left.arrow.right") { editing = ReconciliationEdit(kind: "payment", groupID: groupID) }
                        Text("Insurance payments are not your payments. A correction or void keeps the earlier record and requires a fresh completeness review.").font(.footnote).foregroundStyle(.secondary)
                        ForEach(group.payments.reversed()) { payment in
                            DisclosureGroup {
                                if !payment.receiptReference.isEmpty { Text("Receipt: \(payment.receiptReference)") }
                                if !payment.note.isEmpty { Text(payment.note) }
                                Text("Recorded \(payment.createdAt)").font(.caption).foregroundStyle(.secondary)
                                if let replaced = payment.replacesId { Text("References earlier entry \(replaced)").font(.caption).textSelection(.enabled) }
                                if currentSummary?.activePaymentIds.contains(payment.id) == true {
                                    Button("Correct this entry", systemImage: "pencil") { editing = ReconciliationEdit(kind: "payment", groupID: groupID, recordID: payment.id) }
                                    Button("Void an incorrectly recorded entry", role: .destructive) { editing = ReconciliationEdit(kind: "void", groupID: groupID, recordID: payment.id) }
                                }
                            } label: {
                                VStack(alignment: .leading, spacing: 5) {
                                    Text(ReconciliationLabels.kind(payment.kind)).font(.headline)
                                    if let amount = payment.amountCents { Text(Money.display(amount)).monospacedDigit() }
                                    Text(payment.transactionDate ?? "Transaction date not recorded").font(.footnote).foregroundStyle(.secondary)
                                    if currentSummary?.voidedPaymentIds.contains(payment.id) == true { StatusPill(title: "Voided; kept as history") }
                                    else if currentSummary?.supersededPaymentIds.contains(payment.id) == true { StatusPill(title: "Corrected; kept as history") }
                                }.padding(.vertical, 4)
                            }
                        }
                    }
                    Section("Your review history") {
                        ForEach(group.selections.reversed()) { selection in
                            DisclosureGroup("Review recorded \(String(selection.createdAt.prefix(10)))") {
                                Text("Bill: \(documentLabel(selection.billId, group: group))\nEOB: \(documentLabel(selection.eobId, group: group))\nEstimate: \(documentLabel(selection.estimateId, group: group))")
                                Text("Total-responsibility source: \(selection.responsibilitySource.map(ReconciliationLabels.kind) ?? "Not chosen")")
                                Text(selection.paymentsComplete ? "You marked the payment history complete for this review." : "Payment history was not marked complete.")
                                if !selection.reason.isEmpty { Text(selection.reason) }
                                Text("This is a historical review. Later payment entries invalidate its completeness for a new calculation.").font(.footnote).foregroundStyle(.secondary)
                            }
                        }
                        if group.selections.isEmpty { Text("Choose specific versions and review the payment history before comparing amounts.").foregroundStyle(.secondary) }
                    }
                }.goldRockScreen().navigationTitle("Compare records").navigationBarTitleDisplayMode(.inline)
            } else { ContentUnavailableView("Group unavailable", systemImage: "doc.on.doc") }
        }.sheet(item: $editing) { ReconciliationEditor(caseID: caseID, edit: $0) }
            .onAppear { refresh() }.onChange(of: store.item(caseID)?.updatedAt) { _, _ in refresh() }
    }
    @ViewBuilder private func comparison(_ result: ReconciledGroup) -> some View {
        Section("What these records support") {
            StatusPill(title: result.paymentHistoryComplete ? "Payment history reviewed by you" : "Payment history needs review", symbol: result.paymentHistoryComplete ? "checkmark.circle" : "questionmark.circle")
            if let remaining = result.amounts.expectedRemainingCents {
                RecordedAmount(title: "Calculated remaining", value: Money.display(remaining), detail: "Based on your chosen total and reviewed payment history.")
            } else { RecordedAmount(title: "Calculated remaining", value: "Not established", detail: "Choose a total-responsibility source and review the complete payment history.") }
            if let credit = result.amounts.possibleCreditCents, credit > 0 { RecordedAmount(title: "Possible credit to ask about", value: Money.display(credit), detail: "A calculation from your entries, not a verified refund entitlement.") }
            DisclosureGroup("Figures behind this comparison") {
                LabeledContent("Chosen total patient responsibility", value: Money.display(result.amounts.totalPatientResponsibilityCents))
                LabeledContent("Recorded payments", value: Money.display(result.amounts.recordedPaymentsCents))
                LabeledContent("Recorded refunds", value: Money.display(result.amounts.recordedRefundsCents))
                LabeledContent("Net payments", value: Money.display(result.amounts.recordedNetPaymentsCents))
                Text(result.notice).font(.footnote).foregroundStyle(.secondary)
            }
        }
        Section("Compare, without double-counting") {
            LabeledContent("Bill's displayed remaining balance", value: Money.display(result.amounts.statementBalanceCents))
            LabeledContent("Chosen estimate", value: Money.display(result.amounts.estimateCents))
            if let difference = result.amounts.statementDifferenceCents { LabeledContent("Statement minus calculated remaining", value: Money.display(difference)) }
            Text("Payments are subtracted only from an explicitly chosen total patient responsibility. They are never subtracted again from a bill's displayed remaining balance. Differences are questions to check, not savings.").font(.footnote).foregroundStyle(.secondary)
            if !result.questions.isEmpty { DisclosureGroup("Questions worth checking (\(result.questions.count))") { ForEach(Array(result.questions.enumerated()), id: \.offset) { _, question in Label(question, systemImage: "questionmark.circle").padding(.vertical, 4) } } }
            if !result.unselectedRevisionIds.isEmpty { Text("There are revised documents that have not been selected. Review them deliberately; the newest file is not assumed correct.").font(.footnote) }
        }
    }
    @ViewBuilder private func documentDetails(_ document: ReconciliationDocument) -> some View {
        if let received = document.receivedDate { Text("Received: \(received)") }
        if !document.reference.isEmpty { Text("Your reference: \(document.reference)") }
        if let total = document.totalPatientResponsibilityCents { LabeledContent("Total responsibility recorded", value: Money.display(total)) }
        if let balance = document.statementBalanceCents { LabeledContent("Displayed remaining balance", value: Money.display(balance)) }
        if let estimate = document.estimateCents { LabeledContent("Estimate", value: Money.display(estimate)) }
        ForEach(Array(document.lines.enumerated()), id: \.offset) { index, line in
            VStack(alignment: .leading, spacing: 4) {
                Text(line.label.isEmpty ? "Line \(index + 1)" : line.label)
                Text("\(line.code ?? "No code") · \(Money.display(line.amountCents)) · \(line.units.map { "\($0) units" } ?? "Units unknown")").font(.footnote).foregroundStyle(.secondary)
            }
        }
        Text("Recorded \(document.createdAt). This version cannot be edited; add a corrected version to preserve the original entry.").font(.footnote).foregroundStyle(.secondary)
    }
    private func isSelected(_ id: String, group: ReconciliationGroup) -> Bool {
        guard let selection = group.selections.last else { return false }
        return [selection.billId, selection.eobId, selection.estimateId].contains(id)
    }
    private func documentLabel(_ id: String?, group: ReconciliationGroup) -> String { group.documents.first { $0.id == id }?.label ?? "Not selected" }
    private func refresh() {
        guard let item = store.item(caseID) else { summary = nil; summaryRevision = nil; return }
        do {
            let result = try LocalGuidance.reconciliationSummary(item.reconciliation ?? CaseReconciliation())
            summary = result.groups.first { $0.id == groupID }; summaryRevision = item.updatedAt; problem = nil
        } catch { problem = error.localizedDescription; summary = nil; summaryRevision = nil }
    }
}

private struct ReconciliationDraftLine: Identifiable, Equatable {
    let id = UUID(); var label = ""; var code = ""; var amount = ""; var units = ""
}
private struct ReconciliationEditor: View {
    let caseID: UUID; let edit: ReconciliationEdit
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @State private var values: [String: String] = [:]
    @State private var lines: [ReconciliationDraftLine] = []
    @State private var paymentsComplete = false
    @State private var acknowledged = false
    @State private var loaded = false
    @State private var problem: String?
    @State private var preparation = ReconciliationPreparation()
    @State private var importing = false
    @State private var scanning = false
    @State private var workspace: UUID?
    @State private var captureEpoch = UUID()
    @State private var sourceEpoch: UUID?
    @State private var cameraTask: Task<Void, Never>?
    @State private var importedFields = false
    @State private var reviewedImport = false
    private var group: ReconciliationGroup? { store.item(caseID)?.reconciliation?.groups.first { $0.id == edit.groupID } }
    private var title: String {
        switch edit.kind {
        case "group": "A separate biller and service"
        case "document": edit.recordID == nil ? "Record a document version" : "Add a revised version"
        case "selection": "Choose what to compare"
        case "payment": edit.recordID == nil ? "Record money that moved" : "Correct an earlier entry"
        default: "Void a mistaken record"
        }
    }
    var body: some View {
        NavigationStack {
            Form {
                Section { EditorialListHeader(eyebrow: "Device-only record", title: title, detail: "Keep originals somewhere you control. Enter the figures you reviewed and a short reference, without pasting document text.") }
                editorFields
                if let problem { Section { Text(problem).foregroundStyle(.red); Text("Nothing was saved or replaced. Review the fields and try again.").font(.footnote) } }
            }.goldRockScreen().navigationTitle("Record review").navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { invalidatePreparation(); dismiss() } }
                    ToolbarItem(placement: .confirmationAction) { Button("Save local record", systemImage: "checkmark") { save() }.disabled(!loaded || preparation.busy || preparation.proposal != nil || (importedFields && !reviewedImport) || (edit.kind == "void" && !acknowledged)) }
                }.onAppear { if !loaded { workspace = store.workspaceIdentity; load() } }
                .fileImporter(isPresented: $importing, allowedContentTypes: [.pdf, .jpeg, .png, .heic], allowsMultipleSelection: false) { result in
                    guard sourceEpoch == captureEpoch, isCurrent else { return }
                    sourceEpoch = nil
                    switch result {
                    case .success(let urls): if let url = urls.first { prepare { try await DocumentIntake.importFile(url) } }
                    case .failure: problem = "The file could not be opened. Choose it again or enter the figures manually. Existing history is unchanged."
                    }
                }
                .fullScreenCover(isPresented: $scanning) {
                    ScannerView { images in
                        scanning = false
                        guard sourceEpoch == captureEpoch, isCurrent else { return }; sourceEpoch = nil
                        prepare { try await DocumentIntake.scan(images) }
                    } onCancel: { scanning = false; sourceEpoch = nil }
                    onError: { _ in
                        scanning = false
                        guard sourceEpoch == captureEpoch, isCurrent else { return }; sourceEpoch = nil
                        problem = "Scanning did not finish. Try fewer pages, check camera access, choose a file or enter the figures manually."
                    }.ignoresSafeArea()
                }
                .onChange(of: scenePhase) { _, phase in if phase == .background { invalidatePreparation() } }
                .onChange(of: store.workspaceIdentity) { _, _ in invalidatePreparation() }
                .onChange(of: store.locked) { _, locked in if locked { invalidatePreparation() } }
                .onChange(of: group?.id) { _, groupID in if edit.kind != "group", groupID == nil { invalidatePreparation() } }
                .onChange(of: values) { _, _ in if importedFields { reviewedImport = false } }
                .onChange(of: lines) { _, _ in if importedFields { reviewedImport = false } }
                .onDisappear { if !scanning && !importing { invalidatePreparation() } }
        }
    }
    @ViewBuilder private var editorFields: some View {
        switch edit.kind {
        case "group":
            Section { field("label", "Group name", limit: 160); field("billerLabel", "Biller / billing entity", limit: 160); field("serviceLabel", "Service scope / visit reference", limit: 160); field("personLabel", "Optional person nickname", limit: 160)
                Text("Use a short nickname rather than a full identity. Groups remain independent. Check the biller and service scope before saving; these labels become part of the recorded history.").font(.footnote) }
        case "document": documentFields
        case "selection": selectionFields
        case "payment": paymentFields
        case "void":
            Section { field("reason", "Why this record was entered incorrectly", limit: 1000, multiline: true); Toggle("Void this entry; retain the original history", isOn: $acknowledged); Text("Voiding does not reverse a real payment. Use a refund entry if money was actually returned. This action only excludes an incorrectly recorded entry from calculations.").font(.footnote) }
        default: Section { Text("Unsupported record type.") }
        }
    }
    private var documentFields: some View {
        Group {
            importFields
            Section("Document reference") {
                Picker("Kind", selection: text("kind")) { Text("Choose the document type").tag(""); ForEach(["bill", "eob", "estimate"], id: \.self) { Text(ReconciliationLabels.kind($0)).tag($0) } }.disabled(edit.recordID != nil)
                field("label", "Version label", limit: 240); field("documentDate", "Document date · YYYY-MM-DD or blank", limit: 10)
                field("receivedDate", "Received date · YYYY-MM-DD or blank", limit: 10); field("reference", "Where you keep this original / short reference", limit: 700, multiline: true)
            }
            Section("Reviewed figures · USD") {
                if values["kind"] == "estimate" { amountField("estimateCents", "Written estimate amount") }
                else if ["bill", "eob"].contains(values["kind"] ?? "") {
                    amountField("totalPatientResponsibilityCents", "Total patient responsibility")
                    Text("Enter only a stated total responsibility before your payments. If the document only shows what remains due, leave this field blank.").font(.footnote).foregroundStyle(.secondary)
                    if values["kind"] == "bill" { amountField("statementBalanceCents", "Bill's displayed remaining balance") }
                }
                else { Text("Choose the document type before entering scoped amounts. An unreadable or mixed source is never assumed to be a bill.").font(.footnote) }
                Text("Blank means unknown. A document version is a snapshot of what you entered; later corrections create another version.").font(.footnote)
            }
            Section("Optional charge lines") {
                ForEach($lines) { $line in
                    VStack(alignment: .leading, spacing: 8) {
                        TextField("Short charge label", text: $line.label)
                        TextField("Medical code, if known", text: $line.code).textInputAutocapitalization(.characters).autocorrectionDisabled()
                        TextField("Line amount · USD or blank", text: $line.amount).keyboardType(.decimalPad)
                        TextField("Units or blank", text: $line.units).keyboardType(.numberPad)
                        Button("Remove unsaved line", role: .destructive) { lines.removeAll { $0.id == line.id } }
                    }.padding(.vertical, 4)
                }
                Button("Add a charge line", systemImage: "plus") { lines.append(ReconciliationDraftLine()) }.disabled(lines.count >= 100)
                Text("Enter the line amount as printed. Lines are not treated as a total responsibility or multiplied to infer what you owe.").font(.footnote)
            }
            if importedFields {
                Section("Your review before saving") {
                    Toggle("I checked the type, amount meanings and lines against the original", isOn: $reviewedImport)
                    Text("This saves a new local version only. Matching, selected versions, payments and analysis facts stay as you recorded them. Nothing is submitted to a biller, insurer or cloud AI.").font(.footnote)
                }
            }
        }
    }
    @ViewBuilder private var importFields: some View {
        Section("Start with a local scan or file") {
            Text("Scan or import the visible pages, then check the suggested figures. Names, filenames, exact dates and document text are never filled into this record. Add only your own short reference below.").font(.footnote).foregroundStyle(.secondary)
            Button("Scan with the camera", systemImage: "doc.viewfinder") { openCamera() }.disabled(preparation.busy)
            Button("Choose PDF or image", systemImage: "doc") {
                guard isCurrent else { return }; sourceEpoch = captureEpoch; importing = true
            }.disabled(preparation.busy)
            Text("Up to 20 pages; files up to 20 MB. Large camera scans may need fewer pages. All preparation stays on this device.").font(.caption).foregroundStyle(.secondary)
            if preparation.busy { ProgressView("Preparing privately on this device…"); Button("Cancel preparation", role: .cancel) { preparation.clear() } }
            if let error = preparation.problem { Text(error).foregroundStyle(.red) }
        }
        if let proposal = preparation.proposal {
            Section("Suggested figures · not yet applied") {
                Text("\(preparation.pages) page(s) prepared locally").font(.footnote)
                if let kind = proposal.candidateKind {
                    LabeledContent("Suggested kind", value: ReconciliationLabels.kind(kind))
                    LabeledContent("Total patient responsibility", value: Money.display(proposal.draft.totalPatientResponsibilityCents))
                    LabeledContent("Bill's remaining balance", value: Money.display(proposal.draft.statementBalanceCents))
                    LabeledContent("Written estimate", value: Money.display(proposal.draft.estimateCents))
                    Text("\(proposal.draft.lines.count) optional line(s). Inspect and correct them in the form before saving.").font(.footnote)
                    if revisionKindMismatch(proposal) { Text("This looks different from the original version's type. It cannot fill this revision. Keep the existing history and enter manually, or add a separate document.").foregroundStyle(.red) }
                    Button("Use these suggestions in the editable form", systemImage: "pencil") { applySuggestions(proposal) }.disabled(preparation.busy || revisionKindMismatch(proposal))
                    Text("This replaces only the unsaved amounts and charge lines below. Your manually entered reference and dates stay intact. It does not save a version.").font(.footnote)
                } else {
                    Text("Document type is uncertain, mixed or unsupported. No amount or line has been guessed. Discard the preparation and choose the type and figures manually.").font(.headline)
                }
                ForEach(Array(proposal.warnings.enumerated()), id: \.offset) { _, warning in Text(warning.message).font(.footnote) }
                Button("Discard preparation and enter manually", role: .cancel) { preparation.clear() }
            }
            Section("Local privacy review") {
                Text(preparation.identifierCategories.isEmpty ? "No identifier signals were found; sensitive details can still be missed." : "Local checks flagged: " + preparation.identifierCategories.joined(separator: ", ") + ". Identifier values are not copied into this record.").font(.footnote)
                ForEach(Array(preparation.warnings.enumerated()), id: \.offset) { _, warning in Text(warning).font(.footnote).foregroundStyle(.secondary) }
                Text(OnDeviceAssistant.availability).font(.footnote)
                Button("Optional on-device model privacy check", systemImage: "sparkles") { preparation.inspectLocally { isCurrent } }.disabled(!preparation.canInspectLocally)
                if let notice = preparation.modelNotice { Text(notice).font(.footnote) }
                Text("The model can miss identifiers. It cannot approve these figures or change the type gate. There is no cloud fallback. Temporary scan text is discarded on apply, discard, close or background.").font(.footnote)
            }
        }
    }
    private var isCurrent: Bool {
        loaded && workspace == store.workspaceIdentity && store.workspaceActive && store.item(caseID) != nil &&
        (edit.kind == "group" || group != nil) && (edit.recordID == nil || edit.kind != "document" || group?.documents.contains { $0.id == edit.recordID } == true)
    }
    private func invalidatePreparation() {
        captureEpoch = UUID(); sourceEpoch = nil; cameraTask?.cancel(); cameraTask = nil
        preparation.clear(); importing = false; scanning = false
    }
    private func prepare(_ read: @escaping () async throws -> IntakeResult) {
        guard isCurrent else { return }; problem = nil
        preparation.prepare(read) { isCurrent }
    }
    private func openCamera() {
        guard isCurrent else { return }
        guard VNDocumentCameraViewController.isSupported else { problem = "The document camera is unavailable on this device. Choose a file or enter the figures manually."; return }
        let run = captureEpoch; sourceEpoch = run; cameraTask?.cancel()
        cameraTask = Task {
            let allowed: Bool
            switch AVCaptureDevice.authorizationStatus(for: .video) {
            case .authorized: allowed = true
            case .notDetermined: allowed = await AVCaptureDevice.requestAccess(for: .video)
            default: allowed = false
            }
            guard !Task.isCancelled, run == captureEpoch, isCurrent else { return }
            if allowed { scanning = true } else { sourceEpoch = nil; problem = "Camera access is unavailable. You can allow it in iPhone Settings, choose a file or enter the figures manually." }
            cameraTask = nil
        }
    }
    private func revisionKindMismatch(_ proposal: ReconciliationIntakeProposal) -> Bool {
        edit.recordID != nil && proposal.candidateKind != values["kind"]
    }
    private func applySuggestions(_ proposal: ReconciliationIntakeProposal) {
        guard isCurrent, !preparation.busy, proposal.status == "ready_for_review", let kind = proposal.candidateKind, !revisionKindMismatch(proposal) else { return }
        values["kind"] = kind
        values["totalPatientResponsibilityCents"] = ReconciliationMoney.input(proposal.draft.totalPatientResponsibilityCents)
        values["statementBalanceCents"] = ReconciliationMoney.input(proposal.draft.statementBalanceCents)
        values["estimateCents"] = ReconciliationMoney.input(proposal.draft.estimateCents)
        lines = proposal.draft.lines.map { ReconciliationDraftLine(code: $0.code ?? "", amount: ReconciliationMoney.input($0.amountCents), units: $0.units.map(String.init) ?? "") }
        importedFields = true; reviewedImport = false; preparation.clear()
    }
    private var selectionFields: some View {
        Group {
            Section("Versions you matched to this group") {
                documentPicker("billId", kind: "bill"); documentPicker("eobId", kind: "eob"); documentPicker("estimateId", kind: "estimate")
                Picker("Total-responsibility basis", selection: text("responsibilitySource")) { Text("Not established").tag(""); Text("Chosen bill's total responsibility").tag("bill"); Text("Chosen EOB's total responsibility").tag("eob") }
                Text("Confirm the biller, person and service scope match. An EOB is not a bill. An estimate is not a final liability or a guaranteed price.").font(.footnote)
            }
            Section("Review the full payment history") {
                if let group {
                    ForEach(group.payments) { payment in
                        VStack(alignment: .leading, spacing: 5) {
                            HStack { Text(ReconciliationLabels.kind(payment.kind)); Spacer(); if let amount = payment.amountCents { Text(Money.display(amount)) } }.font(.subheadline)
                            Text(paymentReviewState(payment, group: group)).font(.footnote).foregroundStyle(.secondary)
                            if !payment.receiptReference.isEmpty { Text(payment.receiptReference).font(.footnote) }
                        }
                    }
                }
                Toggle("I reviewed all my payments and refunds for this group", isOn: $paymentsComplete)
                Text("This includes checking that there were none if the history is empty. Corrections and voids remain visible but only active entries count. An incomplete history leaves the calculated remaining amount unknown.").font(.footnote)
                field("reason", "Why these versions belong together / review note", limit: 1000, multiline: true)
            }
        }
    }
    private var paymentFields: some View {
        Section {
            Picker("What actually happened", selection: text("kind")) { Text("I made a payment").tag("payment"); Text("I received a refund").tag("refund") }
            amountField("amountCents", "Amount · USD")
            field("transactionDate", "Actual date · YYYY-MM-DD or blank", limit: 10)
            field("receiptReference", "Receipt / transaction reference", limit: 700, multiline: true)
            field("note", "Short payment note", limit: 2000, multiline: true)
            Text(edit.recordID == nil ? "Do not record a promised payment or refund as completed. The amount must be positive." : "A corrected entry replaces this entry in calculations; the old entry remains in history. Re-review completeness afterward.").font(.footnote)
        }
    }
    private func documentPicker(_ key: String, kind: String) -> some View {
        Picker(ReconciliationLabels.kind(kind), selection: text(key)) {
            Text("Not selected").tag("")
            ForEach(group?.documents.filter { $0.kind == kind } ?? []) { Text("\($0.label) · \($0.documentDate ?? "date unknown")").tag($0.id) }
        }
    }
    private func paymentReviewState(_ payment: ReconciliationPayment, group: ReconciliationGroup) -> String {
        if payment.kind == "void" { return "Bookkeeping void; no money moved" }
        if let replacement = group.payments.first(where: { $0.replacesId == payment.id }) {
            return replacement.kind == "void" ? "Voided; excluded from the calculation" : "Corrected; only the replacement counts"
        }
        return "Active entry · \(payment.transactionDate ?? "date not recorded")"
    }
    private func text(_ key: String) -> Binding<String> { Binding(get: { values[key] ?? "" }, set: { values[key] = $0 }) }
    private func field(_ key: String, _ label: String, limit: Int, multiline: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(label).font(.subheadline).foregroundStyle(.secondary)
            TextField(multiline ? "Add your reference or note" : "Enter a value", text: Binding(get: { values[key] ?? "" }, set: { values[key] = String($0.prefix(limit)) }), axis: multiline ? .vertical : .horizontal).lineLimit(multiline ? 3...6 : 1...1).autocorrectionDisabled(key.hasSuffix("Date")).accessibilityLabel(label)
        }.padding(.vertical, 4)
    }
    private func amountField(_ key: String, _ label: String) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(label).font(.subheadline).foregroundStyle(.secondary)
            TextField("Leave blank if unknown", text: text(key)).font(.body.monospacedDigit()).keyboardType(.decimalPad).accessibilityLabel(label)
        }.padding(.vertical, 4)
    }
    private func load() {
        guard store.item(caseID) != nil else { problem = "This case is no longer available."; return }
        if edit.kind != "group", group == nil { problem = "This group is no longer available."; return }
        if let id = edit.recordID, edit.kind == "document", group?.documents.contains(where: { $0.id == id }) != true { problem = "The original version is unavailable. Existing history is unchanged."; return }
        if let id = edit.recordID, ["payment", "void"].contains(edit.kind), group?.payments.contains(where: { $0.id == id }) != true { problem = "The original payment record is unavailable. Existing history is unchanged."; return }
        values = ["kind": edit.kind == "document" ? "" : "payment"]
        if edit.kind == "document", let id = edit.recordID, let document = group?.documents.first(where: { $0.id == id }) {
            values = ["kind": document.kind, "label": "", "documentDate": "", "receivedDate": "", "reference": ""]
            // Do not silently carry amounts or charge lines into a revised document.
        }
        if edit.kind == "payment", let id = edit.recordID, let payment = group?.payments.first(where: { $0.id == id }) {
            values = ["kind": payment.kind, "amountCents": ReconciliationMoney.input(payment.amountCents), "transactionDate": payment.transactionDate ?? "", "receiptReference": payment.receiptReference, "note": ""]
        }
        if edit.kind == "selection", let selection = group?.selections.last {
            values = ["billId": selection.billId ?? "", "eobId": selection.eobId ?? "", "estimateId": selection.estimateId ?? "", "responsibilitySource": selection.responsibilitySource ?? ""]
        }
        paymentsComplete = false; loaded = true
    }
    private func nullable(_ value: String?) -> Any { if let value { return value }; return NSNull() }
    private func optional(_ key: String) -> Any { let value = (values[key] ?? "").trimmingCharacters(in: .whitespacesAndNewlines); return nullable(value.isEmpty ? nil : value) }
    private func amount(_ key: String) throws -> Any { if let value = try ReconciliationMoney.parse(values[key] ?? "") { return value }; return NSNull() }
    private func save() {
        do {
            guard isCurrent else { throw AppError.invalid("This editing session is no longer available; existing history is unchanged.") }
            guard !preparation.busy, preparation.proposal == nil, !importedFields || reviewedImport else { throw AppError.invalid("Apply or discard the preparation, then review all imported fields before saving.") }
            var fields: [String: Any] = [:]; let operation: String
            switch edit.kind {
            case "group":
                operation = "addReconciliationGroup"
                for key in ["label", "billerLabel", "serviceLabel", "personLabel"] { fields[key] = values[key] ?? "" }
            case "document":
                guard let kind = values["kind"], ["bill", "eob", "estimate"].contains(kind) else { throw AppError.invalid("Choose the document type after checking the original. Uncertain or mixed documents need manual review.") }
                operation = "addReconciliationDocument"
                fields = ["kind": kind, "label": values["label"] ?? "", "documentDate": optional("documentDate"), "receivedDate": optional("receivedDate"), "reference": values["reference"] ?? "", "revisionOfId": nullable(edit.recordID)]
                if values["kind"] == "estimate" { fields["estimateCents"] = try amount("estimateCents") }
                else { fields["totalPatientResponsibilityCents"] = try amount("totalPatientResponsibilityCents"); if values["kind"] == "bill" { fields["statementBalanceCents"] = try amount("statementBalanceCents") } }
                fields["lines"] = try lines.map { line -> [String: Any] in
                    let code = line.code.trimmingCharacters(in: .whitespacesAndNewlines), rawUnits = line.units.trimmingCharacters(in: .whitespacesAndNewlines)
                    let units: Any
                    if rawUnits.isEmpty { units = NSNull() } else if let value = Int(rawUnits) { units = value } else { throw AppError.invalid("Line units must be a whole number or blank.") }
                    let cents: Any
                    if let value = try ReconciliationMoney.parse(line.amount) { cents = value } else { cents = NSNull() }
                    return ["label": line.label, "code": nullable(code.isEmpty ? nil : code), "amountCents": cents, "units": units]
                }
            case "selection":
                operation = "selectReconciliationDocuments"
                fields = ["billId": optional("billId"), "eobId": optional("eobId"), "estimateId": optional("estimateId"), "responsibilitySource": optional("responsibilitySource"), "paymentsComplete": paymentsComplete, "reason": values["reason"] ?? ""]
            case "payment":
                operation = "addReconciliationPayment"
                fields = ["kind": values["kind"] ?? "payment", "amountCents": try amount("amountCents"), "transactionDate": optional("transactionDate"), "receiptReference": values["receiptReference"] ?? "", "note": values["note"] ?? "", "replacesId": nullable(edit.recordID)]
            case "void":
                guard acknowledged else { throw AppError.invalid("Confirm the entry was recorded incorrectly.") }
                operation = "voidReconciliationPayment"; fields = ["reason": values["reason"] ?? ""]
            default: throw AppError.invalid("This record type is unsupported.")
            }
            try store.update(caseID) { item in
                var arguments: [Any] = [(item.reconciliation ?? CaseReconciliation()).object]
                if edit.kind != "group" { guard let id = edit.groupID else { throw AppError.invalid("Choose a biller/service group first.") }; arguments.append(id) }
                if edit.kind == "void" { guard let id = edit.recordID else { throw AppError.invalid("Choose the incorrect entry first.") }; arguments.append(id) }
                arguments.append(fields); arguments.append(LocalGuidance.reconciliationOptions())
                item.reconciliation = try LocalGuidance.reconciliation(operation, arguments: arguments)
            }
            invalidatePreparation(); dismiss()
        } catch { problem = error.localizedDescription }
    }
}
