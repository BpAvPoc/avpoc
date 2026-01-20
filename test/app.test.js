const request = require('supertest');
const app = require('../src/app');

describe('End-to-End Logic & Security', () => {
    test('Redirects root to /hello/Dev', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/hello/Dev');
    });

    test('Sanitizes XSS payloads', async () => {
        const payload = "<script>alert(1)</script>";
        const res = await request(app).get(`/hello/${encodeURIComponent(payload)}`);
        expect(res.text).toContain('&lt;script&gt;');
        expect(res.text).not.toContain('<script>');
    });

    test('Includes Security Headers', async () => {
        const res = await request(app).get('/hello/Test');
        expect(res.headers).toHaveProperty('content-security-policy');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });
});