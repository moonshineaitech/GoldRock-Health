import SwiftUI

struct FactsForm: View {
    @Binding var facts: PublicFacts
    @Binding var errors: Set<String>
    private let states = "unknown AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI".split(separator: " ").map(String.init)
    var body: some View {
        Section("First, get the context right") {
            Picker("Document", selection: $facts.documentType) { ForEach(DocumentKind.allCases) { Text($0.title).tag($0) } }
            Picker("I want to", selection: $facts.goal) { ForEach(MemberGoal.allCases) { Text($0.title).tag($0) } }
            Picker("Coverage", selection: $facts.coverage) { ForEach(Coverage.allCases) { Text($0.title).tag($0) } }
            DisclosureGroup("Location and setting") {
                Picker("State of care", selection: optionalString($facts.state)) { ForEach(states, id: \.self) { Text($0 == "unknown" ? "Not sure" : $0).tag($0) } }
                Picker("Care setting", selection: optionalString($facts.careSetting)) {
                Text("Not sure").tag("unknown"); Text("Emergency").tag("emergency"); Text("In-network facility").tag("in_network_facility"); Text("Out-of-network facility").tag("out_of_network_facility"); Text("Air ambulance").tag("air_ambulance"); Text("Ground ambulance").tag("ground_ambulance"); Text("Other").tag("other")
                }
            }
        }
        Section {
            AmountField(label: "Total billed", key: "billed", value: $facts.billedCents, errors: $errors)
            AmountField(label: "Adjustments", key: "adjustment", value: $facts.adjustmentCents, errors: $errors)
            AmountField(label: "Insurance paid", key: "insurance", value: $facts.insurancePaidCents, errors: $errors)
            AmountField(label: "You paid", key: "paid", value: $facts.paidCents, errors: $errors)
            AmountField(label: "Current balance", key: "balance", value: $facts.balanceCents, errors: $errors)
            AmountField(label: "EOB responsibility", key: "eob", value: $facts.eobResponsibilityCents, errors: $errors)
            AmountField(label: "Written estimate", key: "estimate", value: $facts.estimateCents, errors: $errors)
        } header: { Label("The numbers on your statement", systemImage: "dollarsign.circle") } footer: { Text("USD · Leave unknown amounts blank. A missing amount is never treated as zero. Use figures from the same statement and claim.") }
        Section("Processing and timing") {
            Picker("Claim", selection: optionalString($facts.claimStatus)) { Text("Not sure").tag("unknown"); Text("Pending").tag("pending"); Text("Processed").tag("processed"); Text("Denied").tag("denied") }
            Picker("Denial reason", selection: optionalString($facts.denialReason)) { Text("Not sure / not applicable").tag("unknown"); Text("Missing or incorrect information").tag("administrative"); Text("Coverage").tag("coverage"); Text("Medical necessity").tag("medical_necessity") }
            OptionalBooleanPicker(label: "Itemized statement", value: $facts.hasItemization)
            OptionalBooleanPicker(label: "Written estimate before care", value: $facts.hasEstimate)
            DaysField(label: "Days since initial bill", key: "billDays", value: $facts.daysSinceInitialBill, errors: $errors)
            DaysField(label: "Days since denial received", key: "denialDays", value: $facts.daysSinceDenialReceived, errors: $errors)
            Text("Exact dates stay local. Elapsed days do not establish an appeal deadline; check the actual notice.").font(.footnote).foregroundStyle(.secondary)
        }
        Section {
            ForEach($facts.lines) { $line in
                VStack(alignment: .leading, spacing: 10) {
                    HStack { Text(line.id).font(.caption).foregroundStyle(.secondary); Spacer(); Button("Remove", role: .destructive) { let id = line.id; facts.lines.removeAll { $0.id == id }; errors.remove(id) }.font(.subheadline) }
                    TextField("Medical code (optional)", text: Binding(get: { line.code ?? "" }, set: { line.code = $0.isEmpty ? nil : $0.uppercased() })).textInputAutocapitalization(.characters).autocorrectionDisabled()
                    AmountField(label: "Line amount", key: line.id, value: Binding(get: { line.amountCents }, set: { line.amountCents = $0 ?? 0 }), errors: $errors, required: true)
                    Stepper("Units: \(line.units)", value: $line.units, in: 1...10000)
                }.padding(.vertical, 5)
            }
            Button("Add a line item", systemImage: "plus") {
                let next = (facts.lines.compactMap { Int($0.id.replacingOccurrences(of: "line-", with: "")) }.max() ?? 0) + 1
                facts.lines.append(BillLine(id: "line-\(next)", code: nil, amountCents: 0, units: 1))
            }.disabled(facts.lines.count >= 100)
        } header: { Text("Optional line items") } footer: { Text("Only code, amount and units can be shared. No names, descriptions, dates, account numbers or claim identifiers. Remove a line if you do not want to share its code.") }
    }
    private func optionalString(_ value: Binding<String?>) -> Binding<String> { Binding(get: { value.wrappedValue ?? "unknown" }, set: { value.wrappedValue = $0 }) }
}
struct AmountField: View {
    let label: String; let key: String
    @Binding var value: Int?
    @Binding var errors: Set<String>
    var required = false
    @State private var text = ""
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            LabeledContent(label) { TextField(required ? "0.00" : "Unknown", text: $text).keyboardType(.decimalPad).multilineTextAlignment(.trailing).accessibilityLabel(label + ", dollars").frame(minWidth: 90) }
            if errors.contains(key) { Text(required && text.isEmpty ? "Enter this line's amount, or remove the line." : "Use an amount such as 124.50.").font(.caption).foregroundStyle(.red) }
        }
        .onAppear { text = Money.input(value) }
        .onChange(of: text) { _, next in
            do { let parsed = try Money.parse(next); if required && parsed == nil { errors.insert(key) } else { value = parsed; errors.remove(key) } }
            catch { errors.insert(key) }
        }
    }
}
struct DaysField: View {
    let label: String; let key: String
    @Binding var value: Int?; @Binding var errors: Set<String>
    @State private var text = ""
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            LabeledContent(label) { TextField("Unknown", text: $text).keyboardType(.numberPad).multilineTextAlignment(.trailing).frame(minWidth: 65).accessibilityLabel(label) }
            if errors.contains(key) { Text("Use a whole number between 0 and 36500.").font(.caption).foregroundStyle(.red) }
        }
        .onAppear { text = value.map(String.init) ?? "" }
        .onChange(of: text) { _, next in if next.isEmpty { value = nil; errors.remove(key) } else if let n = Int(next), (0...36500).contains(n) { value = n; errors.remove(key) } else { errors.insert(key) } }
    }
}
struct OptionalBooleanPicker: View {
    let label: String; @Binding var value: Bool?
    var body: some View {
        Picker(label, selection: Binding(get: { value == nil ? "unknown" : value! ? "yes" : "no" }, set: { value = $0 == "unknown" ? nil : $0 == "yes" })) { Text("Not sure").tag("unknown"); Text("Yes").tag("yes"); Text("No").tag("no") }
    }
}
