const VaultComparator = require("../../../dist/core/VaultComparator.js");
const Vault = require("../../../dist/core/Vault.js");

describe("core/VaultComparator", function() {
    beforeEach(function() {
        this.vault1 = new Vault();
        this.vault2 = new Vault();
        this.vault2.format.clear();
        this.vault2.format.execute(this.vault1.format.history);
    });

    describe("calculateDifferences", function() {
        beforeEach(function() {
            this.vault1 = Vault.createWithDefaults();
            this.vault2 = new Vault();
            this.vault2.format.clear();
            this.vault2.format.execute(this.vault1.format.history);
            this.vault1.createGroup("diff group");
        });

        it("returns expected properties", function() {
            const comparator = new VaultComparator(this.vault1, this.vault2);
            const diffs = comparator.calculateDifferences();
            expect(diffs)
                .to.have.property("original")
                .that.is.an("array");
            expect(diffs)
                .to.have.property("secondary")
                .that.is.an("array");
            expect(diffs)
                .to.have.property("common")
                .that.is.an("array");
        });

        it("common history matches archive with shorter history", function() {
            const comparator = new VaultComparator(this.vault1, this.vault2);
            const { common } = comparator.calculateDifferences();
            expect(common).to.deep.equal(this.vault2.format.history);
        });

        it("common and original histories make up longer vault history", function() {
            const comparator = new VaultComparator(this.vault1, this.vault2);
            const { common, original } = comparator.calculateDifferences();
            expect([...common, ...original]).to.deep.equal(this.vault1.format.history);
        });

        it("shorter history diff is empty", function() {
            const comparator = new VaultComparator(this.vault1, this.vault2);
            const { secondary } = comparator.calculateDifferences();
            expect(secondary).to.have.lengthOf(0);
        });
    });

    describe("vaultsDiffer", function() {
        it("returns false when no differences exist", function() {
            const comparator = new VaultComparator(this.vault1, this.vault2);
            expect(comparator.vaultsDiffer()).to.be.false;
        });

        it("returns false when no differences exist after modification", function() {
            this.vault1.createGroup("hai");
            this.vault2.format.clear();
            this.vault2.format.execute(this.vault1.format.history);
            const comparator = new VaultComparator(this.vault1, this.vault2);
            expect(comparator.vaultsDiffer()).to.be.false;
        });

        it("returns true when an archive is out of date", function() {
            this.vault1.createGroup("hai");
            this.vault2.format.clear();
            this.vault2.format.execute(this.vault1.format.history);
            this.vault1.createGroup("hai again");
            const comparator = new VaultComparator(this.vault1, this.vault2);
            expect(comparator.vaultsDiffer()).to.be.true;
        });

        it("returns true for 2 different archives", function() {
            this.vault1 = Vault.createWithDefaults();
            this.vault2 = Vault.createWithDefaults();
            const comparator = new VaultComparator(this.vault1, this.vault2);
            expect(comparator.vaultsDiffer()).to.be.true;
        });
    });
});
