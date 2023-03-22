const path = require("path");
// 플러그인은 빌드할 때 추가적인 기능을 제공하는 것이기 때문에
// 웹팩이 인식할 수 있게 위에서 require로 불러와야 함

const HtmlWebpackPlugin = require("html-webpack-plugin");
// 로더는 빌드할 때 웹팩이 알아서 인식하고 적용함

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "app.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html")
    })
  ]
};
