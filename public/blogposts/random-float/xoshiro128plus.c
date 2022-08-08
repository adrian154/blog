#include <stdint.h>

/* --- xoshiro128+ --- */
static inline uint32_t rotl(const uint32_t x, int k) {
	return (x << k) | (x >> (32 - k));
}

uint32_t next(uint32_t *s) {
	const uint32_t result = s[0] + s[3];
	const uint32_t t = s[1] << 9;
	s[2] ^= s[0];
	s[3] ^= s[1];
	s[1] ^= s[2];
	s[0] ^= s[3];
	s[2] ^= t;
	s[3] = rotl(s[3], 11);
	return result;
}
/* --- /xoshiro128+ --- */

float int_to_float(uint32_t random) {
    union { uint32_t u32; float f; } u = { .u32 = random >> 9 | 0x3f800000 };
    return u.f - 1.0;
}

int main() {
    uint32_t s[4] = {0xf53190d5, 0xae90215d, 0x56bf0ec4, 0xdb718c86};
    for(int i = 0; i < 10000; i++) {
        printf("%f\n", int_to_float(next(s)));
    }
}