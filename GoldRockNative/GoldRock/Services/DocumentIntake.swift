import Foundation
import UIKit
import PDFKit
import Vision
import NaturalLanguage
import ImageIO

struct IdentifierCandidate: Identifiable, Equatable {
    let id = UUID()
    let category: String
    let value: String
}
struct IntakeResult {
    var text: String
    var pages: Int
    var facts: PublicFacts
    var identifiers: [IdentifierCandidate]
    var warnings: [String]
}

enum DocumentIntake {
    static let maximumPages = 20
    static let maximumBytes = 20 * 1024 * 1024
    static let maximumScanPixels = 24_000_000

    /// The scanner releases each full-resolution page after making a bounded copy.
    /// No photo-library save, temporary file or original-image cache is created.
    static func boundedScanImage(_ image: UIImage) throws -> UIImage {
        let size = image.size
        guard size.width.isFinite, size.height.isFinite, size.width > 0, size.height > 0 else { throw AppError.invalid("A scanned page could not be read. Try again or enter the figures.") }
        let scale = min(2200 / max(size.width, size.height), 1)
        let target = CGSize(width: max(1, floor(size.width * scale)), height: max(1, floor(size.height * scale)))
        let format = UIGraphicsImageRendererFormat(); format.scale = 1; format.opaque = true
        return UIGraphicsImageRenderer(size: target, format: format).image { ctx in
            UIColor.white.setFill(); ctx.fill(CGRect(origin: .zero, size: target)); image.draw(in: CGRect(origin: .zero, size: target))
        }
    }

    /// Rasterization deliberately ignores a PDF's hidden text, metadata, attachments and links.
    /// OCR and document bytes never enter the PublicFacts serializer.
    static func importFile(_ url: URL) async throws -> IntakeResult {
        let worker = Task.detached(priority: .userInitiated) {
            let access = url.startAccessingSecurityScopedResource()
            defer { if access { url.stopAccessingSecurityScopedResource() } }
            let values = try url.resourceValues(forKeys: [.fileSizeKey])
            guard let size = values.fileSize, size <= maximumBytes else { throw AppError.invalid("Choose a document smaller than 20 MB, or enter its key amounts.") }
            let data = try Data(contentsOf: url, options: [])
            guard data.count <= maximumBytes else { throw AppError.invalid("This document exceeds the 20 MB preparation limit.") }
            if url.pathExtension.lowercased() == "pdf" || data.starts(with: Data("%PDF".utf8)) {
                guard let pdf = PDFDocument(data: data), !pdf.isLocked else { throw AppError.invalid("This PDF is locked or unreadable. Open an unlocked copy locally, or enter the key facts.") }
                guard (1...maximumPages).contains(pdf.pageCount) else { throw AppError.invalid("Review up to 20 pages at a time. Split this document locally or enter the key facts.") }
                var text = ""; var lowConfidence = false
                for index in 0..<pdf.pageCount {
                    try Task.checkCancellation()
                    guard let page = pdf.page(at: index) else { continue }
                    let result: (String, Bool) = try autoreleasepool {
                        let bounds = page.bounds(for: .mediaBox)
                        guard bounds.width.isFinite, bounds.height.isFinite, bounds.width > 0, bounds.height > 0 else { throw AppError.invalid("A PDF page has invalid dimensions.") }
                        let scale = min(2200 / max(bounds.width, bounds.height), 3)
                        let format = UIGraphicsImageRendererFormat(); format.scale = 1; format.opaque = true
                        let size = CGSize(width: bounds.width * scale, height: bounds.height * scale)
                        let image = UIGraphicsImageRenderer(size: size, format: format).image { ctx in
                            UIColor.white.setFill(); ctx.fill(CGRect(origin: .zero, size: size))
                            ctx.cgContext.translateBy(x: 0, y: bounds.height * scale)
                            ctx.cgContext.scaleBy(x: scale, y: -scale)
                            ctx.cgContext.translateBy(x: -bounds.minX, y: -bounds.minY)
                            page.draw(with: .mediaBox, to: ctx.cgContext)
                        }
                        return try recognize(image)
                    }
                    text += "\nPage \(index + 1)\n" + result.0
                    lowConfidence = lowConfidence || result.1
                }
                return result(text: text, pages: pdf.pageCount, lowConfidence: lowConfidence)
            }
            guard let source = CGImageSourceCreateWithData(data as CFData, nil), CGImageSourceGetCount(source) > 0,
                  let cg = CGImageSourceCreateThumbnailAtIndex(source, 0, [kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceThumbnailMaxPixelSize: 2200, kCGImageSourceCreateThumbnailWithTransform: true] as CFDictionary) else { throw AppError.invalid("Choose a PDF, JPEG, PNG or HEIC image, or enter the key facts.") }
            let scan = try recognize(UIImage(cgImage: cg))
            return result(text: scan.0, pages: 1, lowConfidence: scan.1)
        }
        return try await withTaskCancellationHandler(operation: { try await worker.value }, onCancel: { worker.cancel() })
    }
    static func scan(_ images: [UIImage]) async throws -> IntakeResult {
        guard (1...maximumPages).contains(images.count) else { throw AppError.invalid("Scan between 1 and 20 pages.") }
        let pixels = images.reduce(0.0) { $0 + Double($1.size.width * $1.scale * $1.size.height * $1.scale) }
        guard pixels.isFinite, pixels <= Double(maximumScanPixels), images.allSatisfy({ max($0.size.width * $0.scale, $0.size.height * $0.scale) <= 2200 }) else { throw AppError.invalid("This scan is too large to prepare safely. Scan fewer pages or enter the figures manually.") }
        let worker = Task.detached(priority: .userInitiated) {
            var text = ""; var lowConfidence = false
            for (index, image) in images.enumerated() {
                try Task.checkCancellation()
                let scan = try recognize(image)
                text += "\nPage \(index + 1)\n" + scan.0
                lowConfidence = lowConfidence || scan.1
            }
            return result(text: text, pages: images.count, lowConfidence: lowConfidence)
        }
        return try await withTaskCancellationHandler(operation: { try await worker.value }, onCancel: { worker.cancel() })
    }
    private static func recognize(_ image: UIImage) throws -> (String, Bool) {
        guard let cg = image.cgImage else { throw AppError.invalid("The image could not be read.") }
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate; request.usesLanguageCorrection = false
        request.recognitionLanguages = ["en-US"]; request.minimumTextHeight = 0.006
        let orientation: CGImagePropertyOrientation
        switch image.imageOrientation {
        case .up: orientation = .up; case .down: orientation = .down; case .left: orientation = .left; case .right: orientation = .right
        case .upMirrored: orientation = .upMirrored; case .downMirrored: orientation = .downMirrored; case .leftMirrored: orientation = .leftMirrored; case .rightMirrored: orientation = .rightMirrored
        @unknown default: orientation = .up
        }
        try VNImageRequestHandler(cgImage: cg, orientation: orientation, options: [:]).perform([request])
        let observations = request.results ?? []
        let candidates = observations.compactMap { $0.topCandidates(1).first }
        return (candidates.map(\.string).joined(separator: "\n"), candidates.contains { $0.confidence < 0.70 })
    }
    static func result(text: String, pages: Int, lowConfidence: Bool = false) -> IntakeResult {
        var warnings = ["Check every amount against the original. OCR can omit or misread information. Conflicting or malformed labeled amounts stay blank for manual review.", "Identifiers can be missed. Document analysis sends only typed facts you approve. Conversations have a separate review for the exact question and selected history."]
        if text.trimmingCharacters(in: .whitespacesAndNewlines).count < 30 { warnings.append("Little readable text was found. Try a clearer image or enter the facts manually.") }
        if lowConfidence { warnings.append("Some text was hard to read. No uncertain amount has been marked as verified.") }
        if text.count > 150_000 { warnings.append("Only the first 150,000 text characters were prepared locally. Enter missing facts manually.") }
        let bounded = String(text.prefix(150_000))
        return IntakeResult(text: bounded, pages: pages, facts: LocalExtractor.facts(from: bounded), identifiers: IdentifierDetector.detect(bounded), warnings: warnings)
    }
}

enum IdentifierDetector {
    static func detect(_ text: String) -> [IdentifierCandidate] {
        let patterns: [(String, String)] = [
            ("Email address", #"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"#),
            ("Social Security number", #"\b[0-9]{3}[- ][0-9]{2}[- ][0-9]{4}\b"#),
            ("Phone number", #"(?:\+1[-. ]?)?\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}\b"#),
            ("Exact date", #"\b(?:[01]?[0-9][/-][0-3]?[0-9][/-](?:19|20)?[0-9]{2}|(?:19|20)[0-9]{2}-[01][0-9]-[0-3][0-9])\b"#),
            ("Account or member identifier", #"\b(?:account|member|subscriber|patient|claim|medical record|mrn|policy)(?:\s*(?:id|number|no\.?|#))?\s*[:#]\s*[A-Z0-9-]{4,}\b"#),
            ("Street address", #"\b[0-9]{1,6}\s+[A-Z0-9 .'-]{2,45}\s(?:STREET|ST|ROAD|RD|AVENUE|AVE|DRIVE|DR|LANE|LN|BLVD|BOULEVARD|COURT|CT)\b"#),
            ("Long identifier", #"\b[0-9]{8,}\b"#)
        ]
        var found: [IdentifierCandidate] = []
        for (category, pattern) in patterns {
            guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else { continue }
            for match in regex.matches(in: text, range: NSRange(text.startIndex..., in: text)).prefix(100) {
                if let range = Range(match.range, in: text) { found.append(.init(category: category, value: String(text[range]))) }
            }
        }
        let tagger = NLTagger(tagSchemes: [.nameType]); tagger.string = text
        tagger.enumerateTags(in: text.startIndex..<text.endIndex, unit: .word, scheme: .nameType, options: [.omitWhitespace, .omitPunctuation, .joinNames]) { tag, range in
            if tag == .personalName || tag == .organizationName || tag == .placeName {
                found.append(.init(category: tag == .personalName ? "Possible name" : "Possible organization or location", value: String(text[range])))
            }
            return found.count < 400
        }
        var seen = Set<String>()
        return found.filter { seen.insert($0.value.lowercased()).inserted }
    }
    static func preview(_ text: String, candidates: [IdentifierCandidate]) -> String {
        var clean = text
        for item in candidates.sorted(by: { $0.value.count > $1.value.count }) { clean = clean.replacingOccurrences(of: item.value, with: "[\(item.category)]", options: .caseInsensitive) }
        return clean
    }
}

enum LocalExtractor {
    static func facts(from text: String) -> PublicFacts {
        var facts = PublicFacts(); let lower = text.lowercased()
        var kinds = Set<DocumentKind>()
        if lower.contains("explanation of benefits") || lower.contains("this is not a bill") { kinds.insert(.eob) }
        if lower.contains("denied") || lower.contains("denial") { kinds.insert(.denial) }
        if lower.contains("good faith estimate") || lower.contains("estimated cost") { kinds.insert(.estimate) }
        if lower.contains("amount due") || lower.contains("balance due") { kinds.insert(.bill) }
        if kinds.count == 1, let kind = kinds.first { facts.documentType = kind }
        if facts.documentType == .estimate { facts.hasEstimate = true }
        if facts.documentType == .denial { facts.claimStatus = "denied" }
        // Only explicit claim-status labels are interpreted. Mixed or unreadable labels
        // stay unknown rather than letting a preferred keyword win.
        if let regex = try? NSRegularExpression(pattern: #"(?im)\bclaim[\t ]+status[\t ]*:?[\t ]*([^\r\n]*)"#) {
            let matches = regex.matches(in: text, range: NSRange(text.startIndex..., in: text))
            if !matches.isEmpty {
                var states = Set<String>(); var unreadable = false
                for match in matches {
                    guard let range = Range(match.range(at: 1), in: text) else { unreadable = true; continue }
                    let value = text[range].trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
                    if ["pending", "processed", "denied"].contains(value) { states.insert(value) } else { unreadable = true }
                }
                if facts.documentType == .denial { states.insert("denied") }
                facts.claimStatus = !unreadable && states.count == 1 ? states.first : "unknown"
            }
        }
        func amount(_ labels: [String]) -> Int? {
            // Inspect every synonym/occurrence and the entire value line. Never prefer the
            // first parseable value over a conflicting or malformed one elsewhere in OCR.
            let alternatives = labels.map { NSRegularExpression.escapedPattern(for: $0) }.joined(separator: "|")
            let pattern = #"(?im)\b(?:"# + alternatives + #")\b[\t ]*(?::[\t ]*)?(?:\r?\n[\t ]*)?([^\r\n]*)"#
            guard let regex = try? NSRegularExpression(pattern: pattern) else { return nil }
            let matches = regex.matches(in: text, range: NSRange(text.startIndex..., in: text))
            guard !matches.isEmpty else { return nil }
            var values = Set<Int>()
            for match in matches {
                guard let range = Range(match.range(at: 1), in: text), let value = try? Money.parse(String(text[range])) else { return nil }
                values.insert(value)
            }
            return values.count == 1 ? values.first : nil
        }
        facts.balanceCents = amount(["balance due", "amount due", "current balance"])
        facts.billedCents = amount(["total charges", "amount billed", "total billed"])
        facts.adjustmentCents = amount(["adjustments", "plan discount", "contractual adjustment"])
        facts.insurancePaidCents = amount(["insurance paid", "plan paid"])
        facts.paidCents = amount(["patient payments", "you paid"])
        facts.eobResponsibilityCents = amount(["patient responsibility", "you may owe"])
        facts.estimateCents = amount(["estimated total", "total estimated cost"])
        let pattern = #"(?im)^\s*([0-9]{5}|[A-Z][0-9]{4})\s+[^\n$]{0,80}\$([0-9][0-9,]*\.[0-9]{2})\s*$"#
        if let regex = try? NSRegularExpression(pattern: pattern) {
            for match in regex.matches(in: text, range: NSRange(text.startIndex..., in: text)).prefix(100) {
                if let codeRange = Range(match.range(at: 1), in: text), let moneyRange = Range(match.range(at: 2), in: text), let cents = try? Money.parse(String(text[moneyRange])) {
                    facts.lines.append(BillLine(id: "line-\(facts.lines.count + 1)", code: String(text[codeRange]).uppercased(), amountCents: cents, units: 1))
                }
            }
        }
        if !facts.lines.isEmpty { facts.hasItemization = true }
        return facts
    }
}
