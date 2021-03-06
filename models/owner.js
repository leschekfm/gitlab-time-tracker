const _ = require('underscore');

const Base = require('./base');

/**
 * owner model
 */
class owner extends Base {
    constructor(config) {
        super(config);
        this.projects = [];
        this.groups = [];
        this.users = [];
    }

    /**
     * query and set the group
     * @returns {Promise}
     */
    getGroup() {
        return new Promise((resolve, reject) => {
            this.get(`groups/?search=${encodeURIComponent(this.config.get('project'))}`)
                .then(group => {
                    if (group.body.length === 0) return reject('Group not found');
                    let filtered = group.body.filter(u => u.path === this.config.get('project'));
                    if (filtered.length === 0) return reject();
                    this.groups = this.groups.concat(filtered);
                    resolve();
                })
                .catch(e => reject(e));
        });
    }

    /**
     * get sub groups
     * @returns {Promise}
     */
    getSubGroups() {
        return new Promise((resolve, reject) => {
            this.get(`groups`)
                .then(groups => {
                    if (groups.body.length === 0) return reject();
                    let filtered = groups.body.filter(u => this.groups.map(g => g.id).indexOf(u.parent_id) !== -1);
                    if (filtered.length === 0) return reject();
                    this.groups = this.groups.concat(filtered);
                    resolve();
                })
                .catch(e => reject(e));
        });
    }

    // /**
    //  * query and set the user
    //  * @returns {Promise}
    //  */
    // getUser() {
    //     return new Promise((resolve, reject) => {
    //         this.get(`users/?username=${encodeURIComponent(this.config.get('project'))}`)
    //             .then(user => {
    //                 if (user.body.length === 0) return reject();
    //                 let filtered = user.body.filter(u => u.username === this.config.get('project'));
    //                 if (filtered.length === 0) return reject();
    //                 this.user = filtered[0];
    //                 resolve();
    //             })
    //             .catch(e => reject(e));
    //     });
    // }
    //
    // /**
    //  * query and set the projects by a user
    //  * @returns {Promise}
    //  */
    // getProjectsByUser() {
    //     return new Promise((resolve, reject) => {
    //         this.get(`users/${this.user.id}/projects`)
    //             .then(projects => {
    //                 this.projects = this.projects.concat(projects.body);
    //                 resolve();
    //             })
    //             .catch(e => reject(e));
    //     });
    // }

    /**
     * query and set the projects by a user
     * @returns {Promise}
     */
    getProjectsByGroup() {
        return this.parallel(this.groups, (group, done) => {
            this.get(`groups/${group.id}/projects`)
                .then(projects => {
                    this.projects = this.projects.concat(projects.body);
                    done();
                })
                .catch(e => done(e));
        });
    }
}

module.exports = owner;