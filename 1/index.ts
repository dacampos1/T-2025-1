const DENOMINATIONS = [10, 50, 100];

function atm_payout(amount: number, i = 0, payout: number[] = []): void {
    if (amount === 0) {
        console.log(payout);
        return;
    }

    if (amount < 0 || i >= DENOMINATIONS.length) {
        return;
    }

    atm_payout(amount - DENOMINATIONS[i], i, [...payout, DENOMINATIONS[i]]);
    
    atm_payout(amount, i + 1, payout);
}

console.log("Payout for 30 EUR");
atm_payout(30);

console.log("\nPayout for 50 EUR");
atm_payout(50);

console.log("\nPayout for 60 EUR");
atm_payout(60);

console.log("\nPayout for 80 EUR");
atm_payout(80);

console.log("\nPayout for 80 EUR");
atm_payout(80);

console.log("\nPayout for 140 EUR");
atm_payout(140);

console.log("\nPayout for 230 EUR");
atm_payout(230);

console.log("\nPayout for 370 EUR");
atm_payout(370);

console.log("\nPayout for 610 EUR");
atm_payout(610);

console.log("\nPayout for 980 EUR");
atm_payout(980);