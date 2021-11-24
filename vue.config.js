module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(pdf)(\?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: 'files/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        }
    },
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            title: 'Corona Pasje',
        },
    }
}
