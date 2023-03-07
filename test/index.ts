import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as math from '../src';

const API = suite('exports');

API('should export an object', () => {
	assert.type(math, 'object');
});

API.run();

