
export default class Breadcrumbs {
    constructor() {}

    getTransition(from, to) {
        let parent = null;
        let from_level = -1;
        let to_level = -1;

        for(let i = 0; i < Breadcrumbs.crumbs.length; i++){
            if(Breadcrumbs.crumbs[i].primary){
                parent = Breadcrumbs.crumbs[i];
                break;
            }
        }

        if(parent){
            from_level = this.recurseCrumbs(parent, from.name);
            to_level = this.recurseCrumbs(parent, to.name);

            if(from_level > to_level){
                //backwards
                return 0;
            } else {
                //forwards
                return 1;
            }
        }
    }

    recurseCrumbs(node, needle) {
        let level = 0;
        if(node === null || node.id === needle){
            return level;
        }

        if(node.children){
            let child;

            for(let i = 0; i < node.children.length; i++){
                child = node.children[i];

                level = this.recurseCrumbs(child, needle) + 1;

                if(this.isChild(node, child)){
                    return level;
                }
            }
        }

        return level;
    }

    isChild(parent, child) {
        let p = this.findNode(Breadcrumbs.crumbs[0], parent);

        if(p) {
            return this.findNode(p, child);
        }

        return null;
    }

    findNode(node, target) {
        if(node.name === target.name){
            return node;
        }

        if(node.children) {
            for(let i = 0; i < node.children.length; i++){
                return this.findNode(node.children[i], target);
            }
        }

        return null;
    }

    static get crumbs () {
        return [
            {
                primary: true,
                name: 'Home',
                id: 'home',
                children: [
                    {
                        name: 'Servers',
                        id: 'servers.index',
                        children: [
                            {
                                name: 'Create',
                                id: 'servers.create'
                            },
                            {
                                name: 'Edit',
                                id: 'servers.edit'
                            }
                        ]
                    },
                    {
                        name: 'Explore',
                        id: 'explore'
                    }
                ]
            }
        ];
    }
}