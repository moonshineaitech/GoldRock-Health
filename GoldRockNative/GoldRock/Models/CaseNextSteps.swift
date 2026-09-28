import Foundation

/// A read-only projection of dates the member recorded. It never invents a deadline
/// or changes a workbook, case, notification, or cloud payload.
struct CaseNextStep: Identifiable, Equatable {
    enum Kind: Equatable {
        case caseFollowUp
        case chosenReminder(process: String)
        case confirmedDate(process: String)
        case dateToVerify(process: String)
    }

    let id: String
    let caseID: UUID
    let caseTitle: String
    let title: String
    let date: Date
    let kind: Kind

    var sourceLabel: String {
        switch kind {
        case .caseFollowUp: "Your case follow-up"
        case .chosenReminder(let process): "Your reminder · \(process)"
        case .confirmedDate(let process): "Date you confirmed · \(process)"
        case .dateToVerify(let process): "Date to verify · \(process)"
        }
    }

    var needsVerification: Bool {
        if case .dateToVerify(_) = kind { return true }
        return false
    }
}

enum CaseNextSteps {
    static func build(from cases: [MemberCase], calendar: Calendar = .current) -> [CaseNextStep] {
        var result: [CaseNextStep] = []
        for item in cases where !item.resolved {
            if let date = item.followUp {
                result.append(CaseNextStep(id: "case-\(item.id.uuidString)", caseID: item.id, caseTitle: item.title,
                                           title: "Follow up on this case", date: date, kind: .caseFollowUp))
            }
            for process in item.workbook?.processes ?? [] where process.status != "closed" && process.status != "resolved" {
                for deadline in process.deadlines {
                    guard let date = recordedDate(deadline.date, calendar: calendar) else { continue }
                    let kind: CaseNextStep.Kind = deadline.kind == "follow_up"
                        ? .chosenReminder(process: process.title)
                        : deadline.confirmed
                            ? .confirmedDate(process: process.title)
                            : .dateToVerify(process: process.title)
                    result.append(CaseNextStep(id: "workbook-\(item.id.uuidString)-\(deadline.id)", caseID: item.id,
                                               caseTitle: item.title, title: deadline.title, date: date, kind: kind))
                }
            }
        }
        return result.sorted {
            let left = calendar.startOfDay(for: $0.date)
            let right = calendar.startOfDay(for: $1.date)
            if left != right { return left < right }
            if $0.needsVerification != $1.needsVerification { return !$0.needsVerification }
            return $0.id < $1.id
        }
    }

    static func status(for step: CaseNextStep, now: Date = Date(), calendar: Calendar = .current) -> String {
        let day = calendar.startOfDay(for: step.date)
        let today = calendar.startOfDay(for: now)
        if day < today { return step.needsVerification ? "Recorded date passed · verify" : "Recorded date passed" }
        if day == today { return step.needsVerification ? "Today · verify date" : "Today" }
        return step.needsVerification ? "Upcoming · verify date" : "Upcoming"
    }

    private static func recordedDate(_ raw: String, calendar: Calendar) -> Date? {
        guard raw.range(of: #"^\d{4}-\d{2}-\d{2}$"#, options: .regularExpression) != nil else { return nil }
        let formatter = DateFormatter()
        formatter.calendar = calendar
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = calendar.timeZone
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.isLenient = false
        guard let parsed = formatter.date(from: raw), formatter.string(from: parsed) == raw else { return nil }
        return parsed
    }
}
