
var vueApp = new Vue({
    el: '#vue-app',
    data: {
        input: "",
        commandTemplates: [
            function(podId, namespace) {
                return {
                    title: 'bash',
                    command: 'kubectl exec -n ' + namespace + ' -it ' + podId + '  bash'
                }
            },
            function(podId, namespace) {
                return {
                    title: 'cp upload',
                    command: 'kubectl cp public/ ' + namespace + '/' + podId + ':/srv/project/public/'
                }
            },
            function(podId, namespace) {
                return {
                    title: 'env',
                    command: 'kubectl exec -n ' + namespace + ' -it ' + podId + '  env'
                }
            },
            function(podId, namespace) {
                return {
                    title: 'logs',
                    command: 'kubectl logs -f ' + podId + ' -n ' + namespace
                }
            },
            function(podId, namespace) {
                return {
                    title: 'delete',
                    command: 'kubectl delete pod ' + podId + ' -n ' + namespace
                }
            }
        ]
    },
    methods: {
    },
    beforeMount() {
        console.log('App mounted!');
        if (localStorage.getItem('moneySeries')) this.moneySeries = JSON.parse(localStorage.getItem('moneySeries'));
    },
    computed: {
        commands: function() {
            let parts = this.input.split(/[ ]+/).map(function(item) {
                return item.trim();
            })
            return this.commandTemplates.map(function(func) {
                return func(parts[1], parts[0])
            })
        },
    }
});