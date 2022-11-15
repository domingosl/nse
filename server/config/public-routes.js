//regex are supported
module.exports = [
    '/api/v1/status',
    { url: '/api/v1/users', methods: ['POST'] },
    { url: '/api/v1/auth/login', methods: ['POST'] },
    { url: '/api/v1/checkout', methods: ['POST'] }
];