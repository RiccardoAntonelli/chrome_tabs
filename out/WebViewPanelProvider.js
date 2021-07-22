'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebViewPanelProvider = void 0;
class WebViewPanelProvider {
    constructor(url) {
        return getWebViewContent(url);
    }
    getWebViewContent(url) {
        return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title></title>
			<style>
				body, html
				  {
					margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
				  }
			  </style>
		</head>
		<body>    
		<iframe src="` + url + `" width="100%" height="100%" ></iframe>
		</body>
		</html>`;
    }
}
exports.WebViewPanelProvider = WebViewPanelProvider;
//# sourceMappingURL=WebViewPanelProvider.js.map