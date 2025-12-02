'use client';

import Navbar from '@/components/Navbar';

export default function HowItWorks() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex gap-12">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('acquisition-process')}
                  className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Acquisition Process
                </button>
                <button
                  onClick={() => scrollToSection('financial-structure')}
                  className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Financial Structure
                </button>
                <button
                  onClick={() => scrollToSection('platform-advantages')}
                  className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Platform Advantages
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Acquisition Process */}
            <div id="acquisition-process" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acquisition Process</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Step 1: Pool Participation (Free)</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Browse our comprehensive card catalog and request cards you believe should be strategically acquired. Join an acquisition pool with no entry fees - participation is completely free. This zero-barrier approach maximizes community engagement and democratizes access to strategic card acquisition.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pool participants are recorded on-chain with full transparency. Your participation grants you proportional rights to future reward distributions based on the acquisition success of your selected card.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Step 2: Pool Activation (50 Participants)</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Once a card pool reaches 50 participants, it automatically transitions to our Active Targets list. This threshold validates sufficient community demand and economic justification for strategic acquisition. Active targets receive priority allocation of treasury resources.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The 50-participant requirement ensures market viability and prevents capital deployment on cards with insufficient community backing.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Step 3: Treasury-Funded Acquisition</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                All card purchases are executed using capital from our treasury wallet funded by BNB. The treasury maintains a 30% capital reserve for operational security while deploying 70% toward active acquisitions. Treasury balance is publicly visible on the Strategy page for complete transparency.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Acquisition strategy focuses on generating sustainable fees through strategic market positioning, creating long-term value for all platform participants.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Step 4: Participant Rewards & Distribution</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Upon successful acquisition, pool participants receive proportional rewards through one of two distribution mechanisms:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 ml-4">
                <li className="leading-relaxed">
                  <span className="font-semibold">Card Distribution:</span> Participants receive a proportional share of the acquired card inventory based on their pool participation percentage. Cards are distributed according to participant wallet addresses with transparent allocation tracking.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">Profit Distribution:</span> Alternative reward structure distributes profits generated from market appreciation and strategic sales. Participants receive BNB-denominated rewards proportional to their pool stake, providing liquidity without requiring physical card distribution.
                </li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                Reward distribution mechanism is determined per card based on market conditions, participant preferences, and optimal value realization strategy. All distributions are executed transparently with on-chain verification.
              </p>
            </div>
          </div>
        </div>

            {/* Financial Structure */}
            <div id="financial-structure" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Structure</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Revenue Model: Token Supply Control</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The platform generates capital for card acquisitions through strategic control of our project token supply:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 ml-4">
                <li className="leading-relaxed">
                  <span className="font-semibold">Platform Token Launch:</span> The project launches its own BNB-based token to fund operations and card acquisitions. This token represents participation in the platform's ecosystem and growth.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">Controlled Token Supply:</span> Platform strategically controls a significant portion of the token supply. This supply control enables sustainable revenue generation through measured token sales and liquidity provision, ensuring long-term operational funding.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">Trading Fee Revenue:</span> Token trading activities generate fees that directly fund the treasury. These fees provide continuous operational capital while maintaining healthy market liquidity for token holders.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">Strategic Token Sales:</span> Controlled portions of platform-held token supply are sold at optimal market conditions to generate BNB revenue. This revenue is converted to fiat and deployed for card acquisitions, creating tangible value backing for token holders.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Treasury Management & Fiat Conversion</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Our treasury operates through a sophisticated conversion and allocation process that bridges cryptocurrency revenue with traditional card market purchases:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 ml-4">
                <li className="leading-relaxed">
                  <span className="font-semibold">Revenue Collection from Token Supply:</span> Platform revenue is generated through controlled token supply management and trading fees, collected in the treasury wallet where it accumulates as BNB. Treasury balance is publicly visible in real-time, providing complete transparency into platform capital reserves and revenue generation from token activities.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">Fiat Conversion Process:</span> To facilitate physical card acquisitions from traditional marketplaces (eBay, TCGPlayer, private sales), treasury BNB holdings are systematically converted to fiat currency (USD) through regulated exchanges. This conversion enables direct purchasing power in the Pokemon card market while maintaining regulatory compliance.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">70% Active Buying Power:</span> After fiat conversion, 70% of treasury capital is deployed toward strategic card acquisitions. This majority allocation maximizes acquisition velocity and ensures aggressive pursuit of targets while maintaining prudent capital management practices.
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold">30% Capital Tax Reserve:</span> A mandatory 30% allocation is reserved specifically for capital gains tax obligations, regulatory compliance costs, and income tax requirements. This conservative tax provisioning ensures full regulatory compliance, prevents unexpected tax liabilities, and maintains platform operational legality.
                </li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                This dual-allocation structure (70% acquisition / 30% tax reserve) ensures platform sustainability while maintaining aggressive acquisition capabilities. Tax reserves are held in stable assets and adjusted quarterly based on actual tax obligations and regulatory requirements.
              </p>
            </div>
          </div>
        </div>

            {/* Platform Advantages */}
            <div id="platform-advantages" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Advantages</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Community Governance</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Democratic card selection process where community participation directly influences acquisition priorities. Each pool vote represents genuine market demand, ensuring capital deployment aligns with collective interest rather than centralized decision-making.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Complete Transparency</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Real-time treasury visibility via public wallet address. All transactions recorded on-chain with full audit trail. Acquisition progress tracked publicly on Strategy page with comprehensive holdings disclosure.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Fee Generation Focus</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Strategic positioning enables sustainable fee generation through market activities. Fee structures designed to provide ongoing revenue while maintaining accessible participant costs and platform growth.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Participant Rewards</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Pool participants receive proportional rewards through card distribution or profit sharing. Reward mechanisms designed to align participant interests with platform success while providing tangible value from acquisition achievements.
              </p>
            </div>
          </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
