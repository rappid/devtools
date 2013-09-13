(function (chrome) {


    var title = "rAppid:js inspector";

    chrome.devtools.panels.elements.createSidebarPane(title, function (sidebar) {

        /***
         * @param sidebar - http://developer.chrome.com/extensions/devtools_panels.html#type-ExtensionSidebarPane
         */

            // said that there is no getSelectedElement method
            // thanks to https://github.com/timstuyckens/chromeextensions-knockoutjs for the $0 trick

            //initial
        updateElementProperties();

        //attach to chrome events so that the sidebarPane refreshes (contains up to date info)
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
        sidebar.onShown.addListener(updateElementProperties);

        //listen to a message send by the background page (when the chrome windows's focus changes)
        chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
            updateElementProperties();
        });

        function updateElementProperties() {
            sidebar.setExpression("(" + getRappidInfo.toString() + ")(" + true + ")");
        }

        // The function is executed in the context of the inspected page.
        function getRappidInfo(shouldSerialize) {
            "use strict";

            var node,
                nodeSelf,
                error;

            try {
                node = $0;
            } catch (e) {
                error = e;
            }

            if (!node || error) {
                return {
                    error: "Element unknown."
                };
            }

            if (!window["rAppid"]) {
                return {
                    error: "No rAppid.js found"
                };
            }

            if (node.inspect) {
                nodeSelf = node.inspect();
            } else {
                return {
                    error: "Element cannot be inspected. Have you set 'enableInspection: true' in your config?"
                };
            }

            if (!nodeSelf) {
                return {
                    error: "Inspection cannot be performed"
                }
            }

            return {
                $: (function($) {
                    var ret = {};

                    for (var key in $) {
                        if ($.hasOwnProperty(key)) {
                            ret[key] = $[key];
                        }
                    }

                    return ret;
                })(nodeSelf.$),

                bindings: (function(bindingAttributes) {
                    var ret = {};

                    for (var key in  bindingAttributes) {
                        if (bindingAttributes.hasOwnProperty(key)) {
                            ret[key] = bindingAttributes[key].value
                        }
                    }

                    return ret;
                })(nodeSelf.$bindingAttributes)
            };

            function debug() {
                console.log.apply(console, Array.prototype.slice.call(arguments));
            }
        }

    });

})
    (chrome);


