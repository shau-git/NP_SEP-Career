import http from 'k6/http';
import { check, sleep } from 'k6';

// PERF TEST: Load testing endpoints (simulating traffic)
export const options = {
    vus: 50, // 50 Virtual Users
    duration: '30s', // Run for 30 seconds
    thresholds: {
        http_req_duration: ['p(95)<500'], // P95 latency < 500ms
    },
};

export default function () {
    const res = http.get('http://[::1]:5173/');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'protocol is HTTP/1.1': (r) => r.proto === 'HTTP/1.1',
    });

    sleep(1);
}
