describe('Key Generator', () => {
  // Simulate the JS function from settings.html
  function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  test('should generate 32 character key', () => {
    const key = generateKey();
    expect(key).toHaveLength(32);
  });

  test('should only contain alphanumeric characters', () => {
    const key = generateKey();
    expect(key).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('should generate different keys', () => {
    const key1 = generateKey();
    const key2 = generateKey();
    expect(key1).not.toBe(key2);
  });

  test('should not contain special characters', () => {
    const key = generateKey();
    expect(key).not.toMatch(/[^A-Za-z0-9]/);
  });
});