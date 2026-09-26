/**
 * Karpaga Vinayaga Autofinance - Application Engine
 * Handles State, Navigation, Payment Processing, Calculators, and Receipt Generation
 */

// Mock Database & State
const AppState = {
  companyProfile: {
    name: "Karpaga Vinayaga Autofinance",
    proprietor: "Mr. Senthil Kumar",
    phone: "8754212858",
    formattedPhone: "+91 87542 12858",
    address: "Ranger Office Road, Near Ortho Hospital",
    landmark: "Near Ortho Hospital"
  },
  currentUser: {
    name: "Rajesh Kumar",
    phone: "+91 98401 23456",
    email: "rajesh.k@gmail.com",
    city: "Chennai, Tamil Nadu",
    cibilScore: 782,
    customerSince: "Oct 2024"
  },

  // Available Loans for the customer
  loans: [
    {
      id: "KV-7829-CV",
      vehicleName: "Tata Ace Gold BS6 Diesel",
      vehicleRegNo: "TN-09-CD-4521",
      vehicleType: "Commercial Vehicle",
      engineNo: "475IDT-918274",
      chassisNo: "MAT618294N102948",
      sanctionedAmount: 550000,
      disbursedDate: "15 Oct 2024",
      tenureMonths: 48,
      tenureCompleted: 24,
      interestRate: 10.5, // % p.a. reducing
      monthlyEmi: 14850,
      nextDueDate: "05 Oct 2026",
      outstandingPrincipal: 264300,
      foreclosureAmount: 268420,
      autoPayStatus: "Active - HDFC Bank eNACH",
      autoPayAccount: "HDFC Bank A/c ***4912",
      loanStatus: "Active",
      health: "Excellent (0 Overdues)",
      hypothecation: "Karpaga Vinayaga Autofinance Ltd"
    },
    {
      id: "KV-9412-AL",
      vehicleName: "Hyundai Creta 1.5 SX(O)",
      vehicleRegNo: "TN-01-BK-8890",
      vehicleType: "Passenger Car",
      engineNo: "G4FL-671239",
      chassisNo: "MALC81204P918231",
      sanctionedAmount: 1100000,
      disbursedDate: "20 Jan 2025",
      tenureMonths: 60,
      tenureCompleted: 20,
      interestRate: 9.25,
      monthlyEmi: 22975,
      nextDueDate: "07 Oct 2026",
      outstandingPrincipal: 778400,
      foreclosureAmount: 786200,
      autoPayStatus: "Active - SBI e-Mandate",
      autoPayAccount: "SBI A/c ***8821",
      loanStatus: "Active",
      health: "Good (1 Delayed Payment)",
      hypothecation: "Karpaga Vinayaga Autofinance Ltd"
    }
  ],

  selectedLoanId: "KV-7829-CV",
  currentView: "home", // home, dashboard, payment, details, history, autopay, support

  // Transaction Ledger History
  transactions: [
    {
      ref: "TXN-KV-20260905-7811",
      date: "05 Sep 2026, 10:14 AM",
      loanId: "KV-7829-CV",
      vehicle: "Tata Ace (TN-09-CD-4521)",
      amount: 14850,
      mode: "UPI (Google Pay)",
      utr: "224819029410",
      status: "Successful",
      principalPart: 11250,
      interestPart: 3600
    },
    {
      ref: "TXN-KV-20260805-4122",
      date: "05 Aug 2026, 09:45 AM",
      loanId: "KV-7829-CV",
      vehicle: "Tata Ace (TN-09-CD-4521)",
      amount: 14850,
      mode: "HDFC eNACH Auto-Debit",
      utr: "NACH8120938491",
      status: "Successful",
      principalPart: 11150,
      interestPart: 3700
    },
    {
      ref: "TXN-KV-20260705-1983",
      date: "05 Jul 2026, 11:20 AM",
      loanId: "KV-7829-CV",
      vehicle: "Tata Ace (TN-09-CD-4521)",
      amount: 14850,
      mode: "Debit Card (RuPay)",
      utr: "381920381029",
      status: "Successful",
      principalPart: 11050,
      interestPart: 3800
    },
    {
      ref: "TXN-KV-20260907-9921",
      date: "07 Sep 2026, 02:15 PM",
      loanId: "KV-9412-AL",
      vehicle: "Hyundai Creta (TN-01-BK-8890)",
      amount: 22975,
      mode: "UPI (PhonePe)",
      utr: "491829301928",
      status: "Successful",
      principalPart: 17200,
      interestPart: 5775
    },
    {
      ref: "TXN-KV-20260807-6744",
      date: "07 Aug 2026, 04:30 PM",
      loanId: "KV-9412-AL",
      vehicle: "Hyundai Creta (TN-01-BK-8890)",
      amount: 22975,
      mode: "SBI e-Mandate",
      utr: "NACH7728192314",
      status: "Successful",
      principalPart: 17050,
      interestPart: 5925
    }
  ],

  // Notifications
  notifications: [
    {
      id: 1,
      title: "Upcoming EMI Reminder",
      text: "Your EMI of ₹14,850 for Tata Ace (TN-09-CD-4521) is due on 05 Oct 2026.",
      time: "2 hours ago",
      unread: true,
      action: "pay"
    },
    {
      id: 2,
      title: "Auto-Debit Scheduled",
      text: "HDFC eNACH auto-debit request will be presented on 05 Oct 2026 morning.",
      time: "Yesterday",
      unread: true,
      action: "view"
    },
    {
      id: 3,
      title: "Payment Receipt Generated",
      text: "Receipt for ₹14,850 paid on 05 Sep 2026 is ready for download.",
      time: "5 Sep 2026",
      unread: false,
      action: "receipt"
    }
  ],

  // Active Checkout state
  checkout: {
    mode: "due", // "due", "partial", "foreclosure"
    customAmount: 14850,
    activeGatewayTab: "upi", // upi, cards, netbanking, autopay, neft
    selectedBank: "HDFC Bank",
    selectedUpiApp: "GPay",
    cardDetails: {
      number: "5241 •••• •••• 4912",
      name: "RAJESH KUMAR",
      expiry: "09/28",
      cvv: "•••"
    }
  }
};

// Helper: Format INR Currency
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper: Get Current Selected Loan
function getActiveLoan() {
  return AppState.loans.find(l => l.id === AppState.selectedLoanId) || AppState.loans[0];
}

// ==========================================================================
// Navigation & View Routing
// ==========================================================================
// Mobile Navigation Drawer Handlers
// ==========================================================================
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (!drawer) return;
  if (drawer.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const toggleBtn = document.getElementById('mobile-menu-toggle');

  if (drawer) drawer.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  if (toggleBtn) toggleBtn.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const toggleBtn = document.getElementById('mobile-menu-toggle');

  if (drawer) drawer.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  if (toggleBtn) toggleBtn.classList.remove('active');
  document.body.style.overflow = '';
}

function switchView(viewName) {
  AppState.currentView = viewName;

  // Update desktop nav links active state
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.view === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile drawer nav links active state
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    if (link.dataset.view === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile bottom bar active state
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close mobile drawer if open
  closeMobileMenu();

  // Hide all view sections
  const views = ['home-view', 'dashboard-view', 'payment-view', 'details-view', 'history-view', 'autopay-view', 'support-view'];
  views.forEach(vId => {
    const el = document.getElementById(vId);
    if (el) el.style.display = 'none';
  });

  // Show target view
  const target = document.getElementById(`${viewName}-view`);
  if (target) {
    target.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Refresh components in this view
  if (viewName === 'dashboard') {
    renderDashboard();
  } else if (viewName === 'payment') {
    renderCheckoutPage();
  } else if (viewName === 'details') {
    renderLoanDetailsPage();
  } else if (viewName === 'history') {
    renderHistoryPage();
  } else if (viewName === 'autopay') {
    renderAutoPayPage();
  }
}

// Switch Active Loan
function switchActiveLoan(loanId) {
  AppState.selectedLoanId = loanId;
  const loan = getActiveLoan();

  // Sync checkout amount
  AppState.checkout.customAmount = loan.monthlyEmi;

  showToast(`Switched to Loan ${loan.id} (${loan.vehicleName})`);

  // Re-render views
  renderDashboard();
  if (AppState.currentView === 'payment') renderCheckoutPage();
  if (AppState.currentView === 'details') renderLoanDetailsPage();
  if (AppState.currentView === 'history') renderHistoryPage();
  if (AppState.currentView === 'autopay') renderAutoPayPage();
}

// ==========================================================================
// Dashboard View Render
// ==========================================================================
function renderDashboard() {
  const loan = getActiveLoan();
  const selectEl = document.getElementById('dashboard-loan-selector');
  if (selectEl) selectEl.value = loan.id;

  // Header and user
  document.getElementById('dash-customer-name').textContent = AppState.currentUser.name;
  document.getElementById('dash-active-vehicle').textContent = `${loan.vehicleName} (${loan.vehicleRegNo})`;

  // KPI 1: Next Due
  document.getElementById('dash-emi-amount').textContent = formatINR(loan.monthlyEmi);
  document.getElementById('dash-due-date').textContent = loan.nextDueDate;

  // KPI 2: Outstanding Balance
  document.getElementById('dash-outstanding-balance').textContent = formatINR(loan.outstandingPrincipal);
  const repaidPct = Math.round(((loan.sanctionedAmount - loan.outstandingPrincipal) / loan.sanctionedAmount) * 100);
  document.getElementById('dash-repaid-pct').textContent = `${repaidPct}% Repaid`;
  document.getElementById('dash-progress-fill').style.width = `${repaidPct}%`;

  // KPI 3: Tenure
  document.getElementById('dash-tenure-text').textContent = `${loan.tenureCompleted} of ${loan.tenureMonths} Mos`;
  document.getElementById('dash-interest-rate').textContent = `${loan.interestRate}% p.a. Reducing`;

  // KPI 4: AutoPay
  document.getElementById('dash-autopay-status').textContent = loan.autoPayStatus;

  // Action banner
  document.getElementById('dash-banner-amount').textContent = formatINR(loan.monthlyEmi);
  document.getElementById('dash-banner-due').textContent = loan.nextDueDate;

  // Loan specs summary
  document.getElementById('dash-spec-sanctioned').textContent = formatINR(loan.sanctionedAmount);
  document.getElementById('dash-spec-disbursed').textContent = loan.disbursedDate;
  document.getElementById('dash-spec-hypo').textContent = loan.hypothecation;
  document.getElementById('dash-spec-cibil').textContent = `${AppState.currentUser.cibilScore} (High)`;

  // Render Repayment Timeline
  renderRepaymentTimeline(loan);
}

// Repayment Schedule Timeline Nodes
function renderRepaymentTimeline(loan) {
  const container = document.getElementById('dash-timeline-container');
  if (!container) return;

  container.innerHTML = '';
  const months = ['Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27'];

  months.forEach((m, idx) => {
    const node = document.createElement('div');
    node.className = 'timeline-node';

    // Status logic: Sep 26 and earlier are paid, Oct 26 is current, later are upcoming
    let statusClass = '';
    let statusBadge = '';

    if (idx < 6) {
      statusClass = 'paid';
      statusBadge = '<span class="badge badge-success" style="font-size:0.625rem;">PAID ✓</span>';
    } else if (idx === 6) {
      statusClass = 'current';
      statusBadge = '<span class="badge badge-warning" style="font-size:0.625rem;">DUE NOW</span>';
    } else {
      statusClass = 'upcoming';
      statusBadge = '<span class="badge badge-info" style="font-size:0.625rem;">SCHEDULED</span>';
    }

    node.classList.add(statusClass);
    node.innerHTML = `
      <div class="timeline-month">${m}</div>
      <div class="timeline-amount">${formatINR(loan.monthlyEmi)}</div>
      <div class="timeline-status">${statusBadge}</div>
    `;
    container.appendChild(node);
  });
}

// ==========================================================================
// Payment Checkout Portal
// ==========================================================================
function renderCheckoutPage() {
  const loan = getActiveLoan();

  // Summary Sidebar elements
  document.getElementById('checkout-loan-id').textContent = loan.id;
  document.getElementById('checkout-vehicle').textContent = `${loan.vehicleName} (${loan.vehicleRegNo})`;

  // Update Amount options
  document.getElementById('opt-regular-val').textContent = formatINR(loan.monthlyEmi);
  document.getElementById('opt-foreclosure-val').textContent = formatINR(loan.foreclosureAmount);

  // Compute final payable
  updatePayableAmount();
}

function selectPaymentAmountOption(optionType) {
  AppState.checkout.mode = optionType;
  const loan = getActiveLoan();

  // Highlight selected card
  document.querySelectorAll('.amount-option').forEach(el => el.classList.remove('selected'));
  const activeOptionEl = document.getElementById(`amount-opt-${optionType}`);
  if (activeOptionEl) activeOptionEl.classList.add('selected');

  const customWrap = document.getElementById('custom-amount-wrapper');

  if (optionType === 'due') {
    AppState.checkout.customAmount = loan.monthlyEmi;
    if (customWrap) customWrap.style.display = 'none';
  } else if (optionType === 'partial') {
    if (customWrap) customWrap.style.display = 'block';
    const customInput = document.getElementById('custom-amount-input');
    AppState.checkout.customAmount = parseFloat(customInput.value) || 20000;
  } else if (optionType === 'foreclosure') {
    AppState.checkout.customAmount = loan.foreclosureAmount;
    if (customWrap) customWrap.style.display = 'none';
  }

  updatePayableAmount();
}

function handleCustomAmountChange(val) {
  const amount = parseFloat(val) || 0;
  AppState.checkout.customAmount = amount;
  updatePayableAmount();
}

function updatePayableAmount() {
  const amount = AppState.checkout.customAmount;
  const formatted = formatINR(amount);

  document.getElementById('checkout-base-emi').textContent = formatted;
  document.getElementById('checkout-total-payable').textContent = formatted;
  document.getElementById('checkout-submit-amount').textContent = formatted;

  // Dynamic QR Code generation update
  const qrAmtLabel = document.getElementById('qr-payable-amount');
  if (qrAmtLabel) qrAmtLabel.textContent = formatted;
}

function switchGatewayTab(tabKey) {
  AppState.checkout.activeGatewayTab = tabKey;

  document.querySelectorAll('.gateway-nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const tabPanels = ['gateway-upi', 'gateway-cards', 'gateway-netbanking', 'gateway-autopay', 'gateway-neft'];
  tabPanels.forEach(pId => {
    const el = document.getElementById(pId);
    if (el) el.style.display = (pId === `gateway-${tabKey}`) ? 'block' : 'none';
  });
}

// Select UPI App
function selectUpiApp(appName) {
  AppState.checkout.selectedUpiApp = appName;
  document.querySelectorAll('.upi-app-card').forEach(card => card.classList.remove('selected'));
  const targetCard = document.getElementById(`upi-${appName.toLowerCase()}`);
  if (targetCard) targetCard.classList.add('selected');
  showToast(`Selected UPI App: ${appName}`);
}

// Select Bank
function selectBank(bankName) {
  AppState.checkout.selectedBank = bankName;
  document.querySelectorAll('.bank-choice-card').forEach(card => card.classList.remove('selected'));
  const el = event.currentTarget;
  if (el) el.classList.add('selected');
  showToast(`Selected Net Banking: ${bankName}`);
}

// Quick Pay from Homepage (by loan number or vehicle reg)
function initiateQuickPayFromHome() {
  const query = document.getElementById('home-quickpay-input').value.trim().toUpperCase();
  if (!query) {
    showToast("Please enter a Loan ID or Vehicle Registration Number", "error");
    return;
  }

  // Find matching loan or default to first
  const match = AppState.loans.find(l => l.id.toUpperCase() === query || l.vehicleRegNo.replace(/\s+/g, '').toUpperCase() === query.replace(/\s+/g, ''));
  if (match) {
    AppState.selectedLoanId = match.id;
    showToast(`Found account for ${match.vehicleName} (${match.vehicleRegNo})`);
  } else {
    showToast(`Account lookup verified. Proceeding with ${AppState.loans[0].id}`);
  }

  switchView('payment');
}

// Initiate Payment Submission & Open 3DS Simulation Modal
function triggerPaymentGateway() {
  const amount = AppState.checkout.customAmount;
  if (!amount || amount < 500) {
    showToast("Minimum payment amount is ₹500", "error");
    return;
  }

  const gatewayModal = document.getElementById('modal-gateway-sim');
  const loan = getActiveLoan();

  document.getElementById('sim-bank-title').textContent = `${AppState.checkout.selectedBank || 'HDFC Bank'} 3D Secure / OTP Verification`;
  document.getElementById('sim-amount-display').textContent = formatINR(amount);
  document.getElementById('sim-mobile-masked').textContent = `******${AppState.currentUser.phone.slice(-4)}`;

  // Clear inputs
  document.querySelectorAll('.otp-box').forEach(box => box.value = '');

  gatewayModal.classList.add('active');
}

// Auto-fill test OTP
function autoFillOtp() {
  const testOtp = "482910";
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, i) => {
    box.value = testOtp[i] || '';
  });
  showToast("Test OTP 482910 auto-filled");
}

// Verify OTP & Finalize Payment
function completePaymentTransaction() {
  const modalSim = document.getElementById('modal-gateway-sim');
  modalSim.classList.remove('active');

  const loan = getActiveLoan();
  const amount = AppState.checkout.customAmount;
  const now = new Date();

  // Create transaction record
  const newTxn = {
    ref: `TXN-KV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    loanId: loan.id,
    vehicle: `${loan.vehicleName} (${loan.vehicleRegNo})`,
    amount: amount,
    mode: AppState.checkout.activeGatewayTab.toUpperCase(),
    utr: `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    status: "Successful",
    principalPart: Math.round(amount * 0.75),
    interestPart: Math.round(amount * 0.25)
  };

  // Add to transactions ledger
  AppState.transactions.unshift(newTxn);

  // Update loan outstanding
  loan.outstandingPrincipal = Math.max(0, loan.outstandingPrincipal - newTxn.principalPart);

  // Show Receipt Modal
  showReceiptModal(newTxn);
  showToast("Payment Successful! Receipt generated.", "success");
}

// Show Receipt Modal
function showReceiptModal(txn) {
  const loan = getActiveLoan();
  const modalReceipt = document.getElementById('modal-receipt');

  document.getElementById('receipt-txn-id').textContent = txn.ref;
  document.getElementById('receipt-utr-no').textContent = txn.utr;
  document.getElementById('receipt-date-time').textContent = txn.date;
  document.getElementById('receipt-loan-id').textContent = txn.loanId;
  document.getElementById('receipt-vehicle-info').textContent = txn.vehicle;
  document.getElementById('receipt-customer-name').textContent = AppState.currentUser.name;
  document.getElementById('receipt-payment-mode').textContent = txn.mode;
  document.getElementById('receipt-amount-paid').textContent = formatINR(txn.amount);
  document.getElementById('receipt-principal-alloc').textContent = formatINR(txn.principalPart);
  document.getElementById('receipt-interest-alloc').textContent = formatINR(txn.interestPart);
  document.getElementById('receipt-remaining-balance').textContent = formatINR(loan.outstandingPrincipal);

  modalReceipt.classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('modal-receipt').classList.remove('active');
  switchView('dashboard');
}

// Print Receipt
function printCurrentReceipt() {
  window.print();
}

// ==========================================================================
// Loan Details & Interactive Amortization Schedule
// ==========================================================================
function renderLoanDetailsPage() {
  const loan = getActiveLoan();

  document.getElementById('det-loan-id').textContent = loan.id;
  document.getElementById('det-vehicle-name').textContent = loan.vehicleName;
  document.getElementById('det-reg-no').textContent = loan.vehicleRegNo;
  document.getElementById('det-engine-no').textContent = loan.engineNo;
  document.getElementById('det-chassis-no').textContent = loan.chassisNo;
  document.getElementById('det-hypothecation').textContent = loan.hypothecation;

  document.getElementById('det-sanctioned').textContent = formatINR(loan.sanctionedAmount);
  document.getElementById('det-disbursed-date').textContent = loan.disbursedDate;
  document.getElementById('det-tenure').textContent = `${loan.tenureMonths} Months (${loan.tenureCompleted} Paid)`;
  document.getElementById('det-interest-rate').textContent = `${loan.interestRate}% p.a. Reducing Balance`;
  document.getElementById('det-monthly-emi').textContent = formatINR(loan.monthlyEmi);
  document.getElementById('det-outstanding').textContent = formatINR(loan.outstandingPrincipal);
  document.getElementById('det-foreclosure-val').textContent = formatINR(loan.foreclosureAmount);

  // Render Amortization Table
  renderAmortizationSchedule(loan);

  // Init Prepayment Simulator values
  calculatePrepaymentImpact();
}

function renderAmortizationSchedule(loan) {
  const tbody = document.getElementById('amortization-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  let currentBalance = loan.sanctionedAmount;
  const monthlyRate = (loan.interestRate / 12) / 100;
  const emi = loan.monthlyEmi;

  for (let i = 1; i <= loan.tenureMonths; i++) {
    const interest = Math.round(currentBalance * monthlyRate);
    const principal = Math.min(currentBalance, emi - interest);
    const closing = Math.max(0, currentBalance - principal);
    const isPaid = i <= loan.tenureCompleted;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${i}</strong></td>
      <td>Installment ${i}</td>
      <td>${formatINR(currentBalance)}</td>
      <td><strong>${formatINR(emi)}</strong></td>
      <td>${formatINR(principal)}</td>
      <td>${formatINR(interest)}</td>
      <td>${formatINR(closing)}</td>
      <td>
        ${isPaid
        ? '<span class="badge badge-success">PAID</span>'
        : (i === loan.tenureCompleted + 1
          ? '<span class="badge badge-warning">CURRENT DUE</span>'
          : '<span class="badge badge-info">UPCOMING</span>')}
      </td>
    `;
    tbody.appendChild(tr);

    currentBalance = closing;
    if (currentBalance <= 0) break;
  }
}

// Prepayment & Tenure Reduction Simulator
function calculatePrepaymentImpact() {
  const loan = getActiveLoan();
  const extraLumpSum = parseFloat(document.getElementById('prep-extra-slider').value) || 50000;
  document.getElementById('prep-extra-label').textContent = formatINR(extraLumpSum);

  // Calculation heuristics
  const tenureSavedMonths = Math.min(loan.tenureMonths - loan.tenureCompleted - 2, Math.round(extraLumpSum / (loan.monthlyEmi * 0.95)));
  const interestSaved = Math.round(tenureSavedMonths * loan.monthlyEmi * 0.35);

  document.getElementById('prep-tenure-saved').textContent = `${tenureSavedMonths} Months Faster`;
  document.getElementById('prep-interest-saved').textContent = formatINR(interestSaved);
}

// ==========================================================================
// Payment History & Ledger
// ==========================================================================
function renderHistoryPage() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const filterLoan = AppState.selectedLoanId;

  const filtered = AppState.transactions.filter(t => t.loanId === filterLoan);

  filtered.forEach(txn => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${txn.date}</strong></td>
      <td><span style="font-family:monospace;font-size:0.75rem;background:#F1F5F9;padding:2px 6px;border-radius:4px;">${txn.ref}</span></td>
      <td>${txn.vehicle}</td>
      <td>${txn.mode}</td>
      <td><strong style="color:var(--primary-navy);">${formatINR(txn.amount)}</strong></td>
      <td><span class="badge badge-success">${txn.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="downloadReceiptForTxn('${txn.ref}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Receipt
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function downloadReceiptForTxn(txnRef) {
  const txn = AppState.transactions.find(t => t.ref === txnRef);
  if (txn) {
    showReceiptModal(txn);
  }
}

// Bulk Statement Export to CSV
function exportStatementCSV() {
  const loan = getActiveLoan();
  let csv = "Date,Transaction Ref,Vehicle,Payment Mode,Amount (INR),Principal Part,Interest Part,Status\n";

  AppState.transactions.forEach(t => {
    csv += `"${t.date}","${t.ref}","${t.vehicle}","${t.mode}",${t.amount},${t.principalPart},${t.interestPart},"${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `KV_Statement_${loan.id}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Downloaded Annual Statement for ${loan.id}`);
}

// ==========================================================================
// AutoPay & e-Mandate Center
// ==========================================================================
function renderAutoPayPage() {
  const loan = getActiveLoan();
  document.getElementById('autopay-loan-id').textContent = loan.id;
  document.getElementById('autopay-vehicle').textContent = `${loan.vehicleName} (${loan.vehicleRegNo})`;
  document.getElementById('autopay-bank-account').textContent = loan.autoPayAccount;
  document.getElementById('autopay-max-cap').textContent = formatINR(loan.monthlyEmi * 2);
}

function toggleAutoPayState(enable) {
  const loan = getActiveLoan();
  loan.autoPayStatus = enable ? "Active - eNACH Mandate" : "Paused by Customer";
  showToast(enable ? "AutoPay Mandate is Active" : "AutoPay has been paused for next cycle");
  renderAutoPayPage();
  renderDashboard();
}

// ==========================================================================
// Public Homepage EMI Calculator Widget
// ==========================================================================
function calculateHomeEmi() {
  const p = parseFloat(document.getElementById('home-calc-principal').value) || 500000;
  const r = (parseFloat(document.getElementById('home-calc-rate').value) || 10.5) / 12 / 100;
  const n = parseInt(document.getElementById('home-calc-tenure').value) || 48;

  // Monthly EMI formula = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayable = emi * n;
  const totalInterest = totalPayable - p;

  document.getElementById('home-calc-principal-label').textContent = formatINR(p);
  document.getElementById('home-calc-rate-label').textContent = `${(r * 12 * 100).toFixed(1)}%`;
  document.getElementById('home-calc-tenure-label').textContent = `${n} Mos`;

  document.getElementById('home-calc-emi-result').textContent = formatINR(emi);
  document.getElementById('home-calc-interest-result').textContent = formatINR(totalInterest);
  document.getElementById('home-calc-total-result').textContent = formatINR(totalPayable);
}

// ==========================================================================
// Toasts & Notifications
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-gold);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--success-emerald);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--danger-crimson);"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Toggle Notification Tray
function toggleNotificationTray() {
  const tray = document.getElementById('notification-tray');
  if (tray) {
    tray.classList.toggle('active');
  }
}

// Copy Helper
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label} to clipboard!`, "success");
  }).catch(() => {
    showToast(`Copied: ${text}`);
  });
}

// Close Modals & Trays on ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    document.getElementById('notification-tray')?.classList.remove('active');
    closeMobileMenu();
  }
});

// Close notification tray on outside click
window.addEventListener('click', (e) => {
  const tray = document.getElementById('notification-tray');
  const notifBtn = document.querySelector('.notification-btn');
  if (tray && tray.classList.contains('active')) {
    if (!tray.contains(e.target) && !notifBtn?.contains(e.target)) {
      tray.classList.remove('active');
    }
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  calculateHomeEmi();
});
