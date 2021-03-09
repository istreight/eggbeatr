import test from 'ava';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Animator from '@functions/Animator';


test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});
