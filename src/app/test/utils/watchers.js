import sinon from 'sinon';


class Watchers {
    constructor() {
        this.sandbox = sinon.createSandbox();
    }

    static watchersList() {
        return {
            "dateNow": [Date, 'now'],
            "math": [Math],
            "windowSetTimeout": [window, 'setTimeout'],
            "windowRequestAnimationFrame": [window, 'requestAnimationFrame']
        };
    }

    static scopes() {
        return {
            "Animator": {
                "mocks": [],
                "spies": ["math"],
                "stubs": [
                    "dateNow",
                    "windowRequestAnimationFrame",
                    "windowSetTimeout"
                ]
            }
        };
    }

    _createMock(mock) {
        return this.sandbox.mock(...mock);
    }

    _createSpy(spy) {
        return this.sandbox.spy(...spy);
    }

    _createStub(stub) {
        return this.sandbox.stub(...stub);
    }

    getAllWatchers(scope = null) {
        let fakeList, scopedWatchers;
        let watcherScopes = Watchers.scopes();
        let watcherList = Watchers.watchersList();

        if (!Object.keys(watcherScopes).includes(scope)) return {};

        scopedWatchers = {};
        fakeList = watcherScopes[scope];

        for (let fakeType in fakeList) {
            let fnCreate, typeObject, typeList = fakeList[fakeType];

            if (fakeType === 'mocks') {
                fnCreate = this._createMock.bind(this);
            } else if (fakeType === 'spies') {
                fnCreate = this._createSpy.bind(this);
            } else if (fakeType === 'stubs') {
                fnCreate = this._createStub.bind(this);
            }

            typeObject = typeList.reduce(
                (acc, fake) => ({
                    ...acc,
                    [fake]: fnCreate(watcherList[fake])
                }),
                {}
            );

            scopedWatchers = { ...scopedWatchers, ...typeObject };
        }

        return scopedWatchers;
    }

    reset() {
        this.sandbox.reset();
    }

    restore() {
        this.sandbox.restore();
    }
}

// Export a singleton instance of Watcher for a pseudo-static effect.
export default Watchers;
