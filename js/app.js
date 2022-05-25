var vueApp = new Vue({
    el: '#vue-app',
    data: {
        input: "",
        namespace: "development",
        podId: "",
        commandTemplates: [
            {
                title: 'bash',
                func: function(podId, namespace) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- bash';
                }
            },
            {
                title: 'upload file to pod',
                params: {'from': 'test.php', 'to': '/srv/project/public/'},
                func: function(podId, namespace, values) {
                    return 'kubectl cp ' + values['from'] + ' ' + namespace + '/' + podId + ':' + values['to'];
                }
            },
            {
                title: 'download file from pod',
                params: {'from': 'test.php', 'to': '.'},
                func: function(podId, namespace, values) {
                    return 'kubectl cp ' + namespace + '/' + podId + ':' + values['from'] + ' ' + values['to'];
                }
            },
            {
                title: 'curl from pod',
                params: {'url': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- curl ' + values['url'];
                }
            },
            {
                title: 'top',
                func: function(podId, namespace) {
                    return 'kubectl top pod ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'describe pod',
                func: function(podId, namespace) {
                    return 'kubectl describe pods ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'PodMetrics',
                func: function(podId, namespace) {
                    return 'kubectl describe PodMetrics ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'env',
                func: function(podId, namespace) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- env';
                }
            },
            {
                title: 'logs',
                func: function(podId, namespace) {
                    return 'kubectl logs -f ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'delete',
                func: function(podId, namespace) {
                    return 'kubectl delete pod ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'port-forward',
                params: {'locahost-port': '5434', 'pod-port': '5434'},
                func: function(podId, namespace, values) {
                    return 'kubectl port-forward ' + podId + ' -n ' + namespace + ' ' + values['locahost-port'] + ':' + values['pod-port']
                }
            },
            {
                title: 'secrets list',
                params: {'secret': ''},
                func: function(podId, namespace) {
                    return 'kubectl get secret -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl edit secret ' + values['secret'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get secret ' + values['secret'] + ' -n ' + namespace + ' -o yaml';
                    }
                ]

            },
            {
                title: 'deployments',
                params: {'deployment': 'auth'},
                func: function(podId, namespace, values) {
                    return 'kubectl get deployments -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl edit deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl rollout restarts deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl rollout  status -w deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get deployment/' + values['deployment'] + ' -n ' + namespace + ' -o yaml';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl scale deployment/' + values['deployment'] + ' -n ' + namespace + ' --replicas=7';
                    }
                ]
            },
        ]
    },
    methods: {
        copy: function(cmd) {
            navigator.clipboard.writeText(cmd);
        },
        selectNS: function(cmd, ns) {
            this.namespace = ns;
            navigator.clipboard.writeText(cmd + ns);
        },
        update: function() {
            let parts = this.input.split(/[ ]+/).map(function(item) {
                return item.trim();
            })

            this.namespace = parts[0];
            this.podId = parts[1];
        }
    },
    beforeMount() {
    },
    computed: {
        commands: function() {
            var t = this;
            return this.commandTemplates.map(function(template) {
                return {
                    title: template.title,
                    params: template.hasOwnProperty('params') ? Object.keys(template.params) : [],
                    command: template.func(t.podId, t.namespace, template.params),
                    commands: template.hasOwnProperty('commands') ? template.commands.map(function(func) {
                        return func(t.podId, t.namespace, template.params);
                    }) : [],
                }
            })
        },
    }
});

document.body.addEventListener("keydown", function(e) {
    if ((e.metaKey || e.ctrlKey) && e.code === 'KeyV') {
        navigator.clipboard.readText()
            .then(text => {
                // vueApp.podId = text;
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }
}, false);
