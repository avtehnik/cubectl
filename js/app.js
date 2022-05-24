var vueApp = new Vue({
    el: '#vue-app',
    data: {
        input: "",
        namespace: "",
        podId: "",
        commandTemplates: [
            {
                title: 'bash',
                params: {},
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
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- curl '+values['url'];
                }
            },
            {
                title: 'top',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl top pod ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'describe pod',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl describe pods ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'PodMetrics',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl describe PodMetrics ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'env',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- env';
                }
            },
            {
                title: 'logs',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl logs -f ' + podId + ' -n ' + namespace;
                }
            },
            {
                title: 'delete',
                params: {},
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
                title: 'deployments list',
                func: function(podId, namespace) {
                    return 'kubectl get deployments -n ' + namespace;
                }
            },
            {
                title: 'deployment',
                params: {'deployment': 'auth'},
                func: function(podId, namespace, values) {
                    return 'kubectl get deployment/' + values['deployment'] + ' -n ' + namespace + ' -o yaml';
                }
            },
            {
                title: 'deployment',
                params: {'deployment': 'auth'},
                func: function(podId, namespace, values) {
                    return 'kubectl edit deployment/' + values['deployment'] + ' -n ' + namespace;
                }
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
                    params: Object.keys(template.params),
                    command: template.func(t.podId, t.namespace, template.params)
                }
            })
        },
    }
});