import SwiftUI
import WebKit

struct ContentView: View {
    @State private var isLoading = true
    @State private var loadingProgress: Double = 0
    @State private var hasError = false
    @State private var canGoBack = false
    @State private var canGoForward = false
    @StateObject private var webViewStore = WebViewStore()
    
    // CHANGE THIS to your deployed Replit URL or custom domain
    let appURL = "https://goldrock-health.replit.app"
    
    var body: some View {
        ZStack {
            WebView(
                url: URL(string: appURL)!,
                store: webViewStore,
                isLoading: $isLoading,
                loadingProgress: $loadingProgress,
                hasError: $hasError,
                canGoBack: $canGoBack,
                canGoForward: $canGoForward
            )
            .ignoresSafeArea(.all, edges: .bottom)
            
            if isLoading && loadingProgress < 0.9 {
                splashOverlay
            }
            
            if hasError {
                errorOverlay
            }
        }
        .preferredColorScheme(.light)
    }
    
    private var splashOverlay: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            VStack(spacing: 24) {
                Image(systemName: "heart.text.clipboard.fill")
                    .font(.system(size: 64))
                    .foregroundColor(.blue)
                Text("GoldRock Health")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                Text("AI Medical Bill Advocate")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                ProgressView(value: loadingProgress)
                    .progressViewStyle(.linear)
                    .frame(width: 200)
                    .tint(.blue)
            }
        }
        .transition(.opacity)
        .animation(.easeOut(duration: 0.3), value: isLoading)
    }
    
    private var errorOverlay: some View {
        ZStack {
            Color(.systemBackground).ignoresSafeArea()
            VStack(spacing: 20) {
                Image(systemName: "wifi.slash")
                    .font(.system(size: 48))
                    .foregroundColor(.secondary)
                Text("Unable to Connect")
                    .font(.title2)
                    .fontWeight(.semibold)
                Text("Please check your internet connection and try again.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
                Button("Try Again") {
                    hasError = false
                    webViewStore.reload()
                }
                .buttonStyle(.borderedProminent)
                .tint(.blue)
            }
        }
    }
}

class WebViewStore: ObservableObject {
    var webView: WKWebView?
    
    func reload() {
        webView?.reload()
    }
    
    func goBack() {
        webView?.goBack()
    }
    
    func goForward() {
        webView?.goForward()
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    let store: WebViewStore
    @Binding var isLoading: Bool
    @Binding var loadingProgress: Double
    @Binding var hasError: Bool
    @Binding var canGoBack: Bool
    @Binding var canGoForward: Bool
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        config.defaultWebpagePreferences = prefs
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        webView.isOpaque = false
        webView.backgroundColor = .white
        
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(
            context.coordinator,
            action: #selector(Coordinator.handleRefresh(_:)),
            for: .valueChanged
        )
        webView.scrollView.refreshControl = refreshControl
        
        store.webView = webView
        
        webView.addObserver(context.coordinator, forKeyPath: "estimatedProgress", options: .new, context: nil)
        webView.addObserver(context.coordinator, forKeyPath: "canGoBack", options: .new, context: nil)
        webView.addObserver(context.coordinator, forKeyPath: "canGoForward", options: .new, context: nil)
        
        webView.load(URLRequest(url: url))
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        var parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
            guard let webView = object as? WKWebView else { return }
            
            DispatchQueue.main.async {
                if keyPath == "estimatedProgress" {
                    self.parent.loadingProgress = webView.estimatedProgress
                } else if keyPath == "canGoBack" {
                    self.parent.canGoBack = webView.canGoBack
                } else if keyPath == "canGoForward" {
                    self.parent.canGoForward = webView.canGoForward
                }
            }
        }
        
        @objc func handleRefresh(_ sender: UIRefreshControl) {
            parent.store.webView?.reload()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                sender.endRefreshing()
            }
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = true
                self.parent.hasError = false
            }
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.loadingProgress = 1.0
            }
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.hasError = true
            }
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.hasError = true
            }
        }
        
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let requestURL = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }
            
            let appHost = URL(string: parent.url.absoluteString)?.host ?? ""
            
            if let host = requestURL.host, host != appHost && navigationAction.navigationType == .linkActivated {
                if requestURL.scheme == "tel" || requestURL.scheme == "mailto" {
                    UIApplication.shared.open(requestURL)
                    decisionHandler(.cancel)
                    return
                }
                
                UIApplication.shared.open(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            decisionHandler(.allow)
        }
        
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if navigationAction.targetFrame == nil || !(navigationAction.targetFrame!.isMainFrame) {
                webView.load(navigationAction.request)
            }
            return nil
        }
        
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let rootVC = windowScene.windows.first?.rootViewController else {
                completionHandler()
                return
            }
            let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
            rootVC.present(alert, animated: true)
        }
        
        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let rootVC = windowScene.windows.first?.rootViewController else {
                completionHandler(false)
                return
            }
            let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
            rootVC.present(alert, animated: true)
        }
    }
}
