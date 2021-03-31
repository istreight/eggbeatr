/**
 * FILENAME:    Watchers.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 23rd, 2021
 *
 * This file contains the utility class for the test suite of the lesson calendar application.
 */

import sinon from 'sinon';

import Animator from '@utils/Animator.js';


class Watchers {
    constructor() {
        this.sandbox = sinon.createSandbox();
    }

    static watchersList() {
        return {
            "animatorSlide": [Animator, 'slide'],
            "animatorTickFade": [Animator, '_tickFade'],
            "animatorTickSlide": [Animator, '_tickSlide'],
            "dateNow": [Date, 'now'],
            "mathMax": [Math, 'max'],
            "mathMin": [Math, 'min'],
            "windowScrollTo": [window, 'scrollTo'],
            "windowSetTimeout": [window, 'setTimeout'],
            "windowRequestAnimationFrame": [window, 'requestAnimationFrame']
        };
    }

    static scopes() {
        return {
            "Animator": {
                "mocks": [],
                "spies": [
                    "animatorSlide",
                    "animatorTickFade",
                    "mathMax",
                    "mathMin",
                    "windowScrollTo"
                ],
                "stubs": [
                    "animatorTickSlide",
                    "dateNow",
                    "windowRequestAnimationFrame",
                    "windowSetTimeout"
                ]
            }
        };
    }

    _create(createFake, fake) {
        let f, [object, property] = fake;

        f = object[property];
        if (f.wrappedMethod) {
            return f;
        }

        return createFake(fake);
    }

    _createMock(mock) {
        return this.sandbox.mock(...mock);
    }

    // Doesn't work with Counter.js (no callsFake method)
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
                    [fake]: this._create(fnCreate, watcherList[fake])
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

export default Watchers;
