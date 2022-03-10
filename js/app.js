var vueApp = new Vue({
    el: '#vue-app',
    data: {
        input: "",
        commandTemplates: [
            {
                title: 'bash',
                params: {},
                func: function(podId, namespace) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + '  bash';
                }
            },
            {
                title: 'cp upload',
                params: {'from': 'test.php','to': '/srv/project/public/'},
                func: function(podId, namespace, values) {
                    return 'kubectl cp ' + values['from'] + ' ' + namespace + '/' + podId + ':' + values['to'];
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
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + '  env';
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
        ]
    },
    methods: {},
    beforeMount() {
        console.log('App mounted!');
    },
    computed: {
        commands: function() {
            let parts = this.input.split(/[ ]+/).map(function(item) {
                return item.trim();
            })

            return this.commandTemplates.map(function(template) {
                return {
                    title: template.title,
                    params: Object.keys(template.params),
                    command: template.func(parts[1], parts[0], template.params)
                }
            })
        },
    }
});