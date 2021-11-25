module.exports = {
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('babel-loader')
            .loader('babel-loader')
            .end()
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
    },
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
