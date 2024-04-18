// import { createProxyMiddleware } from "http-proxy-middleware";
// import { Application } from "express";

// const setupProxy = (app: Application) => {
//   app.use(
//     "/api",
//     createProxyMiddleware({
//       target: "https://api.coinlore.net",
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api": "/", // remove /api from the request path
//       },
//     })
//   );
// };

// export default setupProxy;
