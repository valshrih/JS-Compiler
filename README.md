# ⚡ OpenIDE: Serverless Online IDE & Compiler

## Access here  [OpenIDE](https://valshrih.github.io/Code-Compiler/)
### Build for all by [Kumar Harsh](mailto:kharsh041@gmail.com)


OpenIDE is a high-performance, modern, mobile-first web development workspace that operates entirely on the client side. Built for all by Kumar Harsh, it leverages native browser APIs and **WebAssembly (WASM)** to completely remove the need for a backend compilation server, enabling fast code execution, linting, and formatting directly inside the user's browser cache.

---

## 🚀 Key Features

* **100% Serverless Architecture:** Zero backend dependencies. No `npm install`, node proxies, or external API execution gateways required.
* **Multi-Language Runtime Support:**
  * **JavaScript:** Runs natively via sandboxed browser execution closures.
  * **Python 3:** Powered by a complete [Pyodide WebAssembly](https://pyodide.org/) core compiled into the browser thread.
  * **Java & Go:** Simulated execution environments mapping abstract syntax pattern tokens for quick algorithms evaluation.
* **Premium VS-Code Aesthetic:** Designed with a smooth glassmorphism dark mode theme, code row indexing guides, responsive control wrapping for touch screen tablets, and independent scrolling panels with comfortable console padding.

---

## 📂 Project Structure

To deploy the workspace, simply place these three files together in the exact same directory folder:

```plaintext
├── index.html   # Main structural canvas, navigation controls, and dependency CDNs
├── style.css    # Premium design variables, grid matrix layouts, and responsive breakpoints
└── script.js    # Simulation engines, WebAssembly mounting layers, and state routers
