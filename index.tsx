
// @ts-nocheck
// Fix: Declare jsQR to inform TypeScript about the external library.
declare var jsQR: any;

const AGENTS_STORAGE_KEY = 'DELIVERY_AGENTS_DATA_V6';
const CURRENCY_SYMBOL = 'د.ع';
let agents = [];
let customOrderStatuses = [];
let nextAgentId = 1;
let nextOrderId = 1;
let nextExpenseId = 1;
let pdfGenerationCounter = 0;
let currentlyViewingAgentId = null;
let orderToDeleteAgentId: number | null = null;
let orderToDeleteOrderId: number | null = null;

const CUSTOM_STATUS_OPTION_VALUE = 'CUSTOM_STATUS_INPUT';
const ORDER_STATUSES = ["مع المندوب", "تم التسليم", "ملغي", "مؤجل", "واصل جزئي", CUSTOM_STATUS_OPTION_VALUE];
const PREDEFINED_ORDER_STATUSES_DISPLAY = {
    "مع المندوب": "مع المندوب",
    "تم التسليم": "تم التسليم",
    "ملغي": "ملغي",
    "مؤجل": "مؤجل",
    "واصل جزئي": "واصل جزئي",
    [CUSTOM_STATUS_OPTION_VALUE]: "تخصيص الحالة..."
};
const DEFAULT_ORDER_STATUS = "مع المندوب";
const INACTIVE_STATUSES_PREDEFINED = ["تم التسليم", "ملغي", "مؤجل", "واصل جزئي"];
const STATUS_DELIVERED = "تم التسليم";
const STATUS_PARTIAL = "واصل جزئي";
const STATUS_CANCELLED = "ملغي";


// DOM Elements
// Fix: Cast all DOM elements to their specific types to resolve property access errors.
const agentsListDiv = document.getElementById('agents-list') as HTMLDivElement;
const agentsSection = document.getElementById('agents-section') as HTMLElement;
const agentDetailsSection = document.getElementById('agent-details-section') as HTMLElement;
const agentDetailsNameSpan = document.getElementById('agent-details-name') as HTMLSpanElement;
const agentDetailsPhoneSpan = document.getElementById('agent-details-phone') as HTMLSpanElement;
const agentDetailsAreaSpan = document.getElementById('agent-details-area') as HTMLSpanElement;
const agentDetailsDeliveryFeeSpan = document.getElementById('agent-details-delivery-fee') as HTMLSpanElement;

const agentDetailsActiveOrdersSpan = document.getElementById('agent-details-active-orders') as HTMLSpanElement;
const agentDetailsTotalOrdersSpan = document.getElementById('agent-details-total-orders') as HTMLSpanElement;
const agentDetailsTotalDeliveredAmountSpan = document.getElementById('agent-details-total-delivered-amount') as HTMLSpanElement;
const agentDetailsTotalDeliveryFeesSpan = document.getElementById('agent-details-total-delivery-fees') as HTMLSpanElement;
const agentDetailsTotalExtraExpensesSpan = document.getElementById('agent-details-total-extra-expenses') as HTMLSpanElement;
const agentDetailsNetAfterFeesSpan = document.getElementById('agent-details-net-after-fees') as HTMLSpanElement;


const agentDetailsStatusWithAgentSpan = document.getElementById('agent-details-status-with-agent') as HTMLSpanElement;
const agentDetailsStatusDeliveredSpan = document.getElementById('agent-details-status-delivered') as HTMLSpanElement;
const agentDetailsStatusCancelledSpan = document.getElementById('agent-details-status-cancelled') as HTMLSpanElement;
const agentDetailsStatusDeferredSpan = document.getElementById('agent-details-status-deferred') as HTMLSpanElement;
const agentDetailsStatusPartialSpan = document.getElementById('agent-details-status-partial') as HTMLSpanElement;

const ordersTableBody = document.getElementById('orders-table-body') as HTMLTableSectionElement;
const noOrdersMessage = document.getElementById('no-orders-message') as HTMLElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;

const globalStatsWithAgentSpan = document.getElementById('global-stats-with-agent') as HTMLSpanElement;
const globalStatsDeliveredSpan = document.getElementById('global-stats-delivered') as HTMLSpanElement;
const globalStatsDeferredSpan = document.getElementById('global-stats-deferred') as HTMLSpanElement;
const globalStatsPartialSpan = document.getElementById('global-stats-partial') as HTMLSpanElement;
const globalStatsCancelledSpan = document.getElementById('global-stats-cancelled') as HTMLSpanElement;
const globalStatsActiveOrdersSpan = document.getElementById('global-stats-active-orders') as HTMLSpanElement;
const globalStatsTotalOrdersSpan = document.getElementById('global-stats-total-orders') as HTMLSpanElement;
const globalStatsTotalDeliveredAmountSpan = document.getElementById('global-stats-total-delivered-amount') as HTMLSpanElement;
const globalStatsTotalDeliveryFeesAllAgentsSpan = document.getElementById('global-stats-total-delivery-fees-all-agents') as HTMLSpanElement;
const globalStatsTotalNetAfterFeesAllAgentsSpan = document.getElementById('global-stats-total-net-after-fees-all-agents') as HTMLSpanElement;


const globalSearchInput = document.getElementById('globalSearchInput') as HTMLInputElement;
const globalSearchBtn = document.getElementById('globalSearchBtn') as HTMLButtonElement;
const globalSearchQRBtn = document.getElementById('globalSearchQRBtn') as HTMLButtonElement;
const globalSearchResultsModal = document.getElementById('globalSearchResultsModal') as HTMLElement;
const globalSearchResultsTableBody = document.getElementById('global-search-results-table-body') as HTMLTableSectionElement;
const noGlobalSearchResultsMessage = document.getElementById('no-global-search-results-message') as HTMLElement;

const agentSearchQRBtn = document.getElementById('agentSearchQRBtn') as HTMLButtonElement;

const mainSettingsModal = document.getElementById('mainSettingsModal') as HTMLElement;
const currentAgentActionsModal = document.getElementById('currentAgentActionsModal') as HTMLElement;
const addAgentModal = document.getElementById('addAgentModal') as HTMLElement;
const editAgentModal = document.getElementById('editAgentModal') as HTMLElement;
const addExpenseModal = document.getElementById('addExpenseModal') as HTMLElement;
const addOrderModal = document.getElementById('addOrderModal') as HTMLElement;
const updateStatusModal = document.getElementById('updateStatusModal') as HTMLElement;
const orderHistoryModal = document.getElementById('orderHistoryModal') as HTMLElement;
const orderActionsModal = document.getElementById('orderActionsModal') as HTMLElement;
const deleteOrderConfirmModal = document.getElementById('deleteOrderConfirmModal') as HTMLElement;
const confirmDeleteOrderBtn = document.getElementById('confirmDeleteOrderBtn') as HTMLButtonElement;
const cancelDeleteOrderBtn = document.getElementById('cancelDeleteOrderBtn') as HTMLButtonElement;
const qrScannerModal = document.getElementById('qrScannerModal') as HTMLElement;
const agentExpensesModal = document.getElementById('agentExpensesModal') as HTMLElement;

const addAgentForm = document.getElementById('addAgentForm') as HTMLFormElement;
const editAgentForm = document.getElementById('editAgentForm') as HTMLFormElement;
const addExpenseForm = document.getElementById('addExpenseForm') as HTMLFormElement;
const addOrderForm = document.getElementById('addOrderForm') as HTMLFormElement;
const updateStatusForm = document.getElementById('updateStatusForm') as HTMLFormElement;
const addOrderModalAgentNameSpan = document.getElementById('addOrderModalAgentName') as HTMLSpanElement;
const addExpenseModalAgentNameSpan = document.getElementById('addExpenseModalAgentName') as HTMLSpanElement;
const orderStatusSelect = document.getElementById('orderStatus') as HTMLSelectElement;
const customStatusDiv = document.getElementById('customStatusDiv') as HTMLElement;
const customOrderStatusText = document.getElementById('customOrderStatusText') as HTMLInputElement;
const customOrderStatusIsActiveCheckbox = document.getElementById('customOrderStatusIsActive') as HTMLInputElement;
const newPriceForStatusUpdateDiv = document.getElementById('newPriceForStatusUpdateDiv') as HTMLElement;
const newPriceForStatusUpdateInput = document.getElementById('newPriceForStatusUpdate') as HTMLInputElement;
const statusUpdateNoteTextarea = document.getElementById('statusUpdateNote') as HTMLTextAreaElement;
const orderHistoryListUl = document.getElementById('orderHistoryList') as HTMLUListElement;
const historyOrderReceiptNumberSpan = document.getElementById('historyOrderReceiptNumber') as HTMLSpanElement;
const noHistoryMessage = document.getElementById('no-history-message') as HTMLElement;
const orderActionsModalContentDiv = document.getElementById('orderActionsModalContent') as HTMLDivElement;
const orderActionsModalReceiptNumberSpan = document.getElementById('orderActionsModalReceiptNumber') as HTMLSpanElement;
const currentAgentActionsModalTitle = document.getElementById('currentAgentActionsModalTitle') as HTMLElement;

const qrVideoElement = document.getElementById('qrVideo') as HTMLVideoElement;
const qrCanvasElement = document.getElementById('qrCanvas') as HTMLCanvasElement;
// Fix: Cast qrCanvasElement to HTMLCanvasElement before calling getContext.
const qrCanvasContext = qrCanvasElement.getContext('2d');
const qrScannerStatusP = document.getElementById('qrScannerStatus') as HTMLParagraphElement;
let activeSearchInputForQR: HTMLInputElement | null = null;
let cameraStream: MediaStream | null = null;
let scanAnimationId: number | null = null;

const mainSettingsToggleBtn = document.getElementById('mainSettingsToggleBtn') as HTMLButtonElement;
const currentAgentActionToggleBtn = document.getElementById('currentAgentActionToggleBtn') as HTMLButtonElement;

const addAgentBtnInSettings = document.getElementById('addAgentBtnInSettings') as HTMLButtonElement;
const exportReportBtnInSettings = document.getElementById('exportReportBtnInSettings') as HTMLButtonElement;
const exportGlobalOrdersPDFBtn = document.getElementById('exportGlobalOrdersPDFBtn') as HTMLButtonElement;
const exportGlobalOrdersNonDeliveredPDFBtn = document.getElementById('exportGlobalOrdersNonDeliveredPDFBtn') as HTMLButtonElement;
const exportDataBtnInSettings = document.getElementById('exportDataBtnInSettings') as HTMLButtonElement;
const importDataLabelInSettings = document.getElementById('importDataLabelInSettings') as HTMLLabelElement;
const deleteAllAgentsBtnInSettings = document.getElementById('deleteAllAgentsBtnInSettings') as HTMLButtonElement;

const editCurrentAgentBtnInModal = document.getElementById('editCurrentAgentBtnInModal') as HTMLButtonElement;
const addExpenseForCurrentAgentBtnInModal = document.getElementById('addExpenseForCurrentAgentBtnInModal') as HTMLButtonElement;
const exportAgentOrdersPDFBtnInModal = document.getElementById('exportAgentOrdersPDFBtnInModal') as HTMLButtonElement;
const exportAgentOrdersNonDeliveredPDFBtnInModal = document.getElementById('exportAgentOrdersNonDeliveredPDFBtnInModal') as HTMLButtonElement;
const deleteAllOrdersForCurrentAgentBtnInModal = document.getElementById('deleteAllOrdersForCurrentAgentBtnInModal') as HTMLButtonElement;
const deleteCurrentAgentBtnInModal = document.getElementById('deleteCurrentAgentBtnInModal') as HTMLButtonElement;

const showAddOrderModalBtn = document.getElementById('showAddOrderModalBtn') as HTMLButtonElement;
const viewAgentExpensesBtn = document.getElementById('viewAgentExpensesBtn') as HTMLButtonElement;
const backToAgentsListBtn = document.getElementById('backToAgentsListBtn') as HTMLButtonElement;
const importDataInput = document.getElementById('importDataInput') as HTMLInputElement;

const globalPdfReportContentDiv = document.getElementById('global-pdf-report-content') as HTMLDivElement;
const agentDetailsPrintMetaPlaceholder = agentDetailsSection.querySelector('.print-meta-header-placeholder') as HTMLElement;
const agentDetailsPrintFinancialSummaryPlaceholder = agentDetailsSection.querySelector('.print-financial-summary-placeholder') as HTMLElement;

const expensesModalAgentNameSpan = document.getElementById('expensesModalAgentName') as HTMLSpanElement;
const agentExpensesContent = document.getElementById('agentExpensesContent') as HTMLDivElement;
const expenseControlButtons = document.querySelectorAll('.expenses-controls-group button');



// --- Data Persistence ---
function loadData() {
    const data = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            if (parsedData && Array.isArray(parsedData.agents) &&
                typeof parsedData.nextAgentId === 'number' &&
                typeof parsedData.nextOrderId === 'number') {

                agents = parsedData.agents;
                nextAgentId = parsedData.nextAgentId;
                nextOrderId = parsedData.nextOrderId;
                nextExpenseId = parsedData.nextExpenseId || 1;
                pdfGenerationCounter = parsedData.pdfGenerationCounter || 0;
                customOrderStatuses = parsedData.customOrderStatuses || [];

                agents.forEach(agent => {
                    if (agent.deliveryFee === undefined) agent.deliveryFee = 0;
                    if (!agent.orders) agent.orders = [];
                    if (!agent.expenses) agent.expenses = []; // Initialize expenses array
                    agent.orders.forEach(order => {
                        if (order.price === undefined) order.price = null;
                        if (!order.statusHistory || order.statusHistory.length === 0) {
                            const initialIsActive = !INACTIVE_STATUSES_PREDEFINED.includes(order.status || DEFAULT_ORDER_STATUS);
                            order.statusHistory = [{
                                status: order.status || DEFAULT_ORDER_STATUS,
                                timestamp: order.date || new Date().toISOString(),
                                note: "",
                                isActive: initialIsActive
                            }];
                        } else {
                            order.statusHistory.forEach(entry => {
                                if (typeof entry.isActive !== 'boolean') {
                                    if (PREDEFINED_ORDER_STATUSES_DISPLAY[entry.status] && PREDEFINED_ORDER_STATUSES_DISPLAY[entry.status] !== PREDEFINED_ORDER_STATUSES_DISPLAY[CUSTOM_STATUS_OPTION_VALUE]) {
                                       entry.isActive = !INACTIVE_STATUSES_PREDEFINED.includes(entry.status);
                                    } else { // Custom status
                                       entry.isActive = true; // Default custom to active if not specified
                                    }
                                }
                            });
                        }
                        if (order.statusHistory.length > 0) {
                           order.status = order.statusHistory[order.statusHistory.length - 1].status;
                        } else {
                           order.status = DEFAULT_ORDER_STATUS;
                        }
                    });
                });

            } else if (Array.isArray(parsedData)) { // Legacy data structure
                agents = parsedData;
                nextAgentId = agents.length > 0 ? Math.max(0, ...agents.map(d => d.id || 0)) + 1 : 1;
                const allOrderIds = agents.flatMap(d => (d.orders || []).map(o => o.id || 0));
                nextOrderId = allOrderIds.length > 0 ? Math.max(0, ...allOrderIds) + 1 : 1;
                nextExpenseId = 1;
                pdfGenerationCounter = 0;
                customOrderStatuses = [];

                agents.forEach(agent => {
                    if (agent.deliveryFee === undefined) agent.deliveryFee = 0;
                    if (!agent.orders) agent.orders = [];
                    if (!agent.expenses) agent.expenses = [];
                     agent.orders.forEach(order => {
                        if (order.price === undefined) order.price = null;
                        if (!order.statusHistory || order.statusHistory.length === 0) {
                             const initialIsActive = !INACTIVE_STATUSES_PREDEFINED.includes(order.status || DEFAULT_ORDER_STATUS);
                             order.statusHistory = [{
                                 status: order.status || DEFAULT_ORDER_STATUS,
                                 timestamp: order.date || new Date().toISOString(),
                                 note: "",
                                 isActive: initialIsActive
                             }];
                        } else {
                             order.statusHistory.forEach(entry => {
                                if (typeof entry.isActive !== 'boolean') {
                                   if (PREDEFINED_ORDER_STATUSES_DISPLAY[entry.status] && PREDEFINED_ORDER_STATUSES_DISPLAY[entry.status] !== PREDEFINED_ORDER_STATUSES_DISPLAY[CUSTOM_STATUS_OPTION_VALUE]) {
                                       entry.isActive = !INACTIVE_STATUSES_PREDEFINED.includes(entry.status);
                                    } else {
                                       entry.isActive = true;
                                    }
                                }
                            });
                        }
                        if (order.statusHistory.length > 0) {
                           order.status = order.statusHistory[order.statusHistory.length - 1].status;
                        } else {
                           order.status = DEFAULT_ORDER_STATUS;
                        }
                    });
                });
            } else {
                console.warn("Invalid data structure in localStorage. Initializing fresh data.");
                agents = []; nextAgentId = 1; nextOrderId = 1; nextExpenseId = 1; pdfGenerationCounter = 0; customOrderStatuses = [];
            }
        } catch (e) {
            console.error("Error parsing data from localStorage:", e);
            alert("حدث خطأ أثناء تحميل البيانات المحفوظة. قد تكون البيانات تالفة. سيتم بدء التطبيق ببيانات جديدة.");
            agents = []; nextAgentId = 1; nextOrderId = 1; nextExpenseId = 1; pdfGenerationCounter = 0; customOrderStatuses = [];
        }
    } else {
         agents = []; nextAgentId = 1; nextOrderId = 1; nextExpenseId = 1; pdfGenerationCounter = 0; customOrderStatuses = [];
    }
    renderGlobalStats();
}

function saveData() {
    try {
        const dataToSave = {
            agents: agents,
            nextAgentId: nextAgentId,
            nextOrderId: nextOrderId,
            nextExpenseId: nextExpenseId,
            pdfGenerationCounter: pdfGenerationCounter,
            customOrderStatuses: customOrderStatuses
        };
        localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(dataToSave));
        renderGlobalStats();
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
        alert("حدث خطأ أثناء حفظ البيانات. قد تكون مساحة التخزين ممتلئة. لن يتم حفظ التغييرات الأخيرة.");
    }
}

// --- Utility Functions ---
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function getActiveOrdersCount(agent) {
    if (!agent || !agent.orders) return 0;
    return agent.orders.filter(order => {
        if (!order.statusHistory || order.statusHistory.length === 0) {
            return !INACTIVE_STATUSES_PREDEFINED.includes(DEFAULT_ORDER_STATUS);
        }
        const currentStatusEntry = order.statusHistory[order.statusHistory.length - 1];
        return currentStatusEntry.isActive;
    }).length;
}

function getAgentTotalOrdersCount(agent) {
    return agent && agent.orders ? agent.orders.length : 0;
}

function formatNumber(num, isCurrency = false) {
    const value = Number(num);
    if (isNaN(value)) {
         return isCurrency ? `0 ${CURRENCY_SYMBOL}` : '0';
    }
    const options = {
        useGrouping: true,
        maximumFractionDigits: isCurrency ? 2 : 0,
        minimumFractionDigits: (isCurrency && value % 1 !== 0) ? 2 : 0
    };
    const formattedNum = value.toLocaleString('en-US', options);
    return isCurrency ? `${formattedNum} ${CURRENCY_SYMBOL}` : formattedNum;
}


function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    } catch (e) {
        console.error("Error formatting date (DD/MM):", e);
        return 'تاريخ غير صالح';
    }
}

function formatDateTime(dateString) {
     if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${datePart} ${timePart}`;
    } catch (e) {
        console.error("Error formatting date-time:", e);
        return 'تاريخ-وقت غير صالح';
    }
}

function getFormattedDateTimeForPrint() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${year}/${month}/${day} ${hours}:${minutesStr} ${ampm}`;
}


function sanitizeHTML(str) {
    if (typeof str !== 'string' && typeof str !== 'number') str = String(str);
    else if(typeof str === 'number') str = str.toString();
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function fuzzyMatch(term, text) {
    if (!term) return true; // Empty search term matches everything
    if (typeof text !== 'string' && typeof text !== 'number') return false; // Can only search strings or numbers

    const lowerTerm = term.toLowerCase();
    const lowerText = String(text).toLowerCase();

    // 1. Direct substring match is fastest and most common
    if (lowerText.includes(lowerTerm)) {
        return true;
    }

    // 2. Levenshtein distance for fuzzy matching
    const n = lowerTerm.length;
    const m = lowerText.length;

    // Abort if term is too short for a meaningful fuzzy search
    // or if the length difference is too large to be a likely typo.
    if (n < 3 || Math.abs(n - m) > 4) {
        return false;
    }

    const d = [];
    // Initialize first column
    for (let i = 0; i <= n; i++) {
        d[i] = [i];
    }
    // Initialize first row
    for (let j = 1; j <= m; j++) {
        d[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = (lowerText[j - 1] === lowerTerm[i - 1]) ? 0 : 1;
            d[i][j] = Math.min(
                d[i - 1][j] + 1,      // deletion
                d[i][j - 1] + 1,      // insertion
                d[i - 1][j - 1] + cost // substitution
            );
        }
    }

    const distance = d[n][m];
    // Allow 1 error for every 3 characters in the search term.
    const maxDistance = Math.floor(n / 3);

    return distance <= maxDistance;
}


// --- Modal Management ---
function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'flex';
    modalElement.setAttribute('aria-hidden', 'false');
    const focusable = modalElement.querySelector('input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])');
    if (focusable) (focusable as HTMLElement).focus();
}

function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
}

// Fix: Cast elements from querySelectorAll to HTMLElement to access onclick and dataset.
document.querySelectorAll('.close-btn').forEach(btn => {
    (btn as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const modalToClose = document.getElementById((btn as HTMLElement).dataset.modalId!);
        if (modalToClose) {
            if (modalToClose.id === 'qrScannerModal') {
                closeQRScannerModalView();
            } else {
                closeModal(modalToClose);
            }
        }
    }
});

window.onclick = (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
        if (target.id === 'qrScannerModal') {
            closeQRScannerModalView();
        } else {
            closeModal(target);
        }
    }
    document.querySelectorAll('.action-menu-content.show').forEach(menu => {
        if (!menu.contains(target) && !target.closest('.action-menu-toggle')) {
            menu.classList.remove('show');
        }
    });
};

function populateStatusSelect(selectElement, selectedStatus = null) {
    selectElement.innerHTML = '';

    // Combine predefined and custom statuses
    const statusList = [...ORDER_STATUSES];
    const customStatusOptionIndex = statusList.indexOf(CUSTOM_STATUS_OPTION_VALUE);
    if (customOrderStatuses) {
        const customStatusNames = customOrderStatuses.map(cs => cs.name);
        // Insert custom statuses before the "Add Custom" option
        statusList.splice(customStatusOptionIndex, 0, ...customStatusNames);
    }

    const uniqueStatuses = [...new Set(statusList)]; // Remove duplicates just in case

    uniqueStatuses.forEach(statusValue => {
        const option = document.createElement('option');
        option.value = statusValue;
        // For custom statuses, the text is the value itself. For predefined, look it up.
        option.textContent = PREDEFINED_ORDER_STATUSES_DISPLAY[statusValue] || statusValue;

        if (statusValue === selectedStatus) {
            option.selected = true;
        }
        // This is for when the *current* status of an order is custom and hasn't been saved to the global list yet.
        // In that case, we want to pre-select "Add Custom" to allow the user to see it/edit it.
        else if (selectedStatus && !uniqueStatuses.includes(selectedStatus) && statusValue === CUSTOM_STATUS_OPTION_VALUE) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}
populateStatusSelect(orderStatusSelect);

orderStatusSelect.addEventListener('change', function() {
    newPriceForStatusUpdateInput.value = ''; // Clear price on status change

    if (this.value === CUSTOM_STATUS_OPTION_VALUE) {
        customStatusDiv.classList.remove('hidden');
        customOrderStatusText.focus();
        customOrderStatusIsActiveCheckbox.checked = true; // Default custom to active

        newPriceForStatusUpdateDiv.classList.remove('hidden');
        newPriceForStatusUpdateInput.placeholder = "ادخل السعر الجديد (اختياري)";
        newPriceForStatusUpdateInput.required = false;

    } else if (this.value === STATUS_PARTIAL) {
        customStatusDiv.classList.add('hidden');
        customOrderStatusText.value = '';

        newPriceForStatusUpdateDiv.classList.remove('hidden');
        newPriceForStatusUpdateInput.placeholder = "ادخل السعر الجديد";
        newPriceForStatusUpdateInput.required = true; // Or handle with JS validation
        newPriceForStatusUpdateInput.focus();

    } else {
        customStatusDiv.classList.add('hidden');
        customOrderStatusText.value = '';

        newPriceForStatusUpdateDiv.classList.add('hidden');
        newPriceForStatusUpdateInput.required = false;
    }
});

 // --- QR Code Scanner Logic ---
function startQRScanLoop() {
    if (!cameraStream || qrVideoElement.readyState !== qrVideoElement.HAVE_ENOUGH_DATA) {
        if(cameraStream) scanAnimationId = requestAnimationFrame(startQRScanLoop);
        return;
    }

    if (!qrCanvasContext) return;
    qrCanvasElement.height = qrVideoElement.videoHeight;
    qrCanvasElement.width = qrVideoElement.videoWidth;
    qrCanvasContext.drawImage(qrVideoElement, 0, 0, qrCanvasElement.width, qrCanvasElement.height);
    const imageData = qrCanvasContext.getImageData(0, 0, qrCanvasElement.width, qrCanvasElement.height);

    if (typeof jsQR === 'undefined') {
        console.error('jsQR library is not loaded.');
        qrScannerStatusP.textContent = 'خطأ: مكتبة المسح غير محملة.';
        closeQRScannerModalView();
        return;
    }

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
        qrScannerStatusP.textContent = `تم العثور على الرمز: ${sanitizeHTML(code.data)}`;
        if (activeSearchInputForQR) {
            activeSearchInputForQR.value = code.data;
            if (activeSearchInputForQR.id === 'globalSearchInput') {
                globalSearchBtn.click();
            } else if (activeSearchInputForQR.id === 'searchInput' && currentlyViewingAgentId !== null) {
                renderAgentDetails(currentlyViewingAgentId, activeSearchInputForQR.value);
            }
        }
        closeQRScannerModalView();
        return;
    } else {
         qrScannerStatusP.textContent = "جاري البحث عن رمز...";
    }
    scanAnimationId = requestAnimationFrame(startQRScanLoop);
}

async function openQRScannerView(targetInputElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("متصفحك لا يدعم الوصول إلى الكاميرا.");
        return;
    }
    activeSearchInputForQR = targetInputElement;
    qrScannerStatusP.textContent = "جاري طلب الوصول إلى الكاميرا...";
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        qrVideoElement.srcObject = cameraStream;
        // Fix: Use the playsInline property instead of setAttribute for boolean values.
        qrVideoElement.playsInline = true;

        qrVideoElement.onloadedmetadata = () => {
            qrVideoElement.play();
            qrScannerStatusP.textContent = "وجه الكاميرا نحو الرمز...";
            openModal(qrScannerModal);
            if (scanAnimationId) cancelAnimationFrame(scanAnimationId);
            scanAnimationId = requestAnimationFrame(startQRScanLoop);
        };

    } catch (err) {
        console.error("Error accessing camera: ", err);
        qrScannerStatusP.textContent = "لم يتمكن من الوصول إلى الكاميرا. يرجى التحقق من الأذونات.";
        alert("لم يتمكن من الوصول إلى الكاميرا. يرجى التحقق من الأذونات وإعادة المحاولة.");
        activeSearchInputForQR = null;
         closeModal(qrScannerModal);
    }
}

function closeQRScannerModalView() {
    if (scanAnimationId) {
        cancelAnimationFrame(scanAnimationId);
        scanAnimationId = null;
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    qrVideoElement.srcObject = null;
    if(qrScannerModal) closeModal(qrScannerModal);
    activeSearchInputForQR = null;
    qrScannerStatusP.textContent = "وجه الكاميرا نحو الرمز...";
}

globalSearchQRBtn.addEventListener('click', () => openQRScannerView(globalSearchInput));
agentSearchQRBtn.addEventListener('click', () => openQRScannerView(searchInput));


// --- Rendering Functions ---
function renderGlobalStats() {
    let totalWithAgent = 0;
    let totalDelivered = 0;
    let totalCancelled = 0;
    let totalDeferred = 0;
    let totalPartial = 0;
    let totalActiveOrders = 0;
    let overallTotalOrders = 0;
    let overallTotalDeliveredAmount = 0;
    let overallTotalDeliveryFeesForAllAgents = 0;
    let overallTotalExpensesForAllAgents = 0;


    agents.forEach(agent => {
        overallTotalOrders += getAgentTotalOrdersCount(agent);
        const agentDeliveryFee = parseFloat(agent.deliveryFee) || 0;
        let agentCollectedOrPartiallyDeliveredOrdersCountForThisAgent = 0;

        if (agent.orders) {
            agent.orders.forEach(order => {
                if (order.statusHistory && order.statusHistory.length > 0) {
                    const latestStatusEntry = order.statusHistory[order.statusHistory.length - 1];
                    const status = latestStatusEntry.status;

                    switch (status) {
                        case "مع المندوب": totalWithAgent++; break;
                        case STATUS_DELIVERED:
                            totalDelivered++;
                            if (order.price != null) {
                                overallTotalDeliveredAmount += parseFloat(order.price);
                            }
                            agentCollectedOrPartiallyDeliveredOrdersCountForThisAgent++;
                            break;
                        case STATUS_CANCELLED: totalCancelled++; break;
                        case "مؤجل": totalDeferred++; break;
                        case STATUS_PARTIAL:
                            totalPartial++;
                             if (order.price != null) {
                                overallTotalDeliveredAmount += parseFloat(order.price);
                            }
                            agentCollectedOrPartiallyDeliveredOrdersCountForThisAgent++;
                            break;
                        default:
                            // For custom statuses, count as "with agent" if active, or based on specific logic if needed
                            if (latestStatusEntry.isActive) {
                                // Potentially add to a "custom active" counter if desired
                            }
                            break;
                    }
                    if (latestStatusEntry.isActive) {
                        totalActiveOrders++;
                    }
                }
            });
        }
        overallTotalDeliveryFeesForAllAgents += (agentCollectedOrPartiallyDeliveredOrdersCountForThisAgent * agentDeliveryFee);
        if (agent.expenses && agent.expenses.length > 0) {
            agent.expenses.forEach(expense => {
                overallTotalExpensesForAllAgents += parseFloat(expense.amount || 0);
            });
        }
    });

    const overallNetAfterFeesAndExpensesForAllAgents = overallTotalDeliveredAmount - overallTotalDeliveryFeesForAllAgents - overallTotalExpensesForAllAgents;


    globalStatsTotalOrdersSpan.textContent = formatNumber(overallTotalOrders);
    globalStatsActiveOrdersSpan.textContent = formatNumber(totalActiveOrders);

    globalStatsWithAgentSpan.textContent = formatNumber(totalWithAgent);
    globalStatsDeliveredSpan.textContent = formatNumber(totalDelivered);
    globalStatsDeferredSpan.textContent = formatNumber(totalDeferred);
    globalStatsPartialSpan.textContent = formatNumber(totalPartial);
    globalStatsCancelledSpan.textContent = formatNumber(totalCancelled);
    globalStatsTotalDeliveredAmountSpan.textContent = formatNumber(overallTotalDeliveredAmount, true);
    globalStatsTotalDeliveryFeesAllAgentsSpan.textContent = formatNumber(overallTotalDeliveryFeesForAllAgents, true);
    // globalStatsTotalExpensesAllAgentsSpan.textContent = formatNumber(overallTotalExpensesForAllAgents, true); // This line is removed as per request
    globalStatsTotalNetAfterFeesAllAgentsSpan.textContent = formatNumber(overallNetAfterFeesAndExpensesForAllAgents, true);
}


function renderAgentsList() {
    agentsListDiv.innerHTML = '';
    if (agents.length === 0) {
        agentsListDiv.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--secondary-color);">لا يوجد مندوبون مضافون حاليًا. ابدأ بإضافة مندوب جديد.</p>';
    } else {
        agents.forEach(agent => {
            const activeOrdersCount = getActiveOrdersCount(agent);
            const totalOrdersCount = getAgentTotalOrdersCount(agent);

            const card = document.createElement('div');
            card.className = 'agent-card';
            card.innerHTML = `
                <div class="action-menu-container">
                    <button class="action-menu-toggle agent-card-menu-toggle" aria-label="خيارات المندوب ${sanitizeHTML(agent.name)}" data-target-menu="agent-menu-${agent.id}">&#8942;</button>
                    <div id="agent-menu-${agent.id}" class="action-menu-content">
                        <button data-agent-id="${agent.id}" class="delete-agent-btn danger">حذف المندوب</button>
                    </div>
                </div>
                <h4>${sanitizeHTML(agent.name)}</h4>
                <p><strong>الهاتف:</strong> ${sanitizeHTML(agent.phone)}</p>
                <p><strong>المنطقة:</strong> ${sanitizeHTML(agent.area)}</p>
                <p><strong>أجرة التوصيل:</strong> ${formatNumber(agent.deliveryFee || 0, true)}</p>
                <p><strong>الطلبات النشطة:</strong> ${formatNumber(activeOrdersCount)}</p>
                <p><strong>إجمالي الطلبات:</strong> ${formatNumber(totalOrdersCount)}</p>
                <div class="agent-card-actions">
                    <button data-agent-id="${agent.id}" class="view-details-btn">عرض التفاصيل</button>
                </div>
            `;
            agentsListDiv.appendChild(card);
        });
    }

    // Fix: Cast elements from querySelectorAll to HTMLElement to access onclick and dataset.
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        (btn as HTMLElement).onclick = () => showAgentDetails(parseInt((btn as HTMLElement).dataset.agentId!));
    });
    document.querySelectorAll('.delete-agent-btn').forEach(btn => {
        (btn as HTMLElement).onclick = (e) => {
             e.stopPropagation();
            deleteAgent(parseInt((btn as HTMLElement).dataset.agentId!));
            const menuId = (btn as HTMLElement).closest('.action-menu-content')!.id;
            document.getElementById(menuId)!.classList.remove('show');
        }
    });
    setupActionMenuToggleListeners();
    renderGlobalStats();
}

function renderAgentDetails(agentId, searchTerm = '') {
    const agent = agents.find(d => d.id === agentId);
    if (!agent) {
        console.error("Agent not found for ID:", agentId);
        backToAgentsList();
        return;
    }

    currentlyViewingAgentId = agentId;
    agentDetailsNameSpan.textContent = sanitizeHTML(agent.name);
    document.querySelector<HTMLSpanElement>('#agent-details-name-heading #agent-details-name')!.textContent = sanitizeHTML(agent.name);
    agentDetailsPhoneSpan.textContent = sanitizeHTML(agent.phone);
    agentDetailsAreaSpan.textContent = sanitizeHTML(agent.area);
    agentDetailsDeliveryFeeSpan.textContent = formatNumber(agent.deliveryFee || 0, true);

    let agentTotalCollectedAmount = 0;
    let withAgentCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let deferredCount = 0;
    let partialCount = 0;
    let collectedOrPartiallyDeliveredOrdersCount = 0;
    let totalExtraExpenses = 0;


    const agentOrders = agent.orders || [];
    agentOrders.forEach(order => {
        if (order.statusHistory && order.statusHistory.length > 0) {
            const latestStatusEntry = order.statusHistory[order.statusHistory.length - 1];
            const latestStatus = latestStatusEntry.status;

            switch (latestStatus) {
                case "مع المندوب": withAgentCount++; break;
                case STATUS_DELIVERED:
                    deliveredCount++;
                    if (order.price != null && !isNaN(parseFloat(order.price))) {
                        agentTotalCollectedAmount += parseFloat(order.price);
                    }
                    collectedOrPartiallyDeliveredOrdersCount++;
                    break;
                 case STATUS_PARTIAL:
                    partialCount++;
                     if (order.price != null && !isNaN(parseFloat(order.price))) {
                        agentTotalCollectedAmount += parseFloat(order.price);
                    }
                    collectedOrPartiallyDeliveredOrdersCount++;
                    break;
                case STATUS_CANCELLED: cancelledCount++; break;
                case "مؤجل": deferredCount++; break;
                default:
                    // For custom statuses, check the isActive flag
                    if (latestStatusEntry.isActive) {
                        // Potentially count as "with agent" or a separate "custom active" counter
                    }
                    break;
            }
        }
    });

    if (agent.expenses && agent.expenses.length > 0) {
        agent.expenses.forEach(expense => {
            totalExtraExpenses += parseFloat(expense.amount || 0);
        });
    }

    const agentDeliveryFee = parseFloat(agent.deliveryFee) || 0;
    const totalDeliveryFees = collectedOrPartiallyDeliveredOrdersCount * agentDeliveryFee;
    const netAfterFeesAndExpenses = agentTotalCollectedAmount - totalDeliveryFees - totalExtraExpenses;

    agentDetailsActiveOrdersSpan.textContent = formatNumber(getActiveOrdersCount(agent));
    agentDetailsTotalOrdersSpan.textContent = formatNumber(getAgentTotalOrdersCount(agent));
    agentDetailsTotalDeliveredAmountSpan.textContent = formatNumber(agentTotalCollectedAmount, true);
    agentDetailsTotalDeliveryFeesSpan.textContent = formatNumber(totalDeliveryFees, true);
    agentDetailsTotalExtraExpensesSpan.textContent = formatNumber(totalExtraExpenses, true);
    agentDetailsNetAfterFeesSpan.textContent = formatNumber(netAfterFeesAndExpenses, true);


    agentDetailsStatusWithAgentSpan.textContent = formatNumber(withAgentCount);
    agentDetailsStatusDeliveredSpan.textContent = formatNumber(deliveredCount);
    agentDetailsStatusCancelledSpan.textContent = formatNumber(cancelledCount);
    agentDetailsStatusDeferredSpan.textContent = formatNumber(deferredCount);
    agentDetailsStatusPartialSpan.textContent = formatNumber(partialCount);


    const currentAgentActionWrapper = document.getElementById('current-agent-action-menu-container-wrapper');
    if(currentAgentActionWrapper) currentAgentActionWrapper.classList.remove('hidden');

    const hasExpenses = agent.expenses && agent.expenses.length > 0;
    viewAgentExpensesBtn.disabled = !hasExpenses;

    ordersTableBody.innerHTML = '';

    const filteredOrders = agentOrders.filter(order => {
        const term = searchTerm.trim();
        if (!term) return true;

        // Use simple 'includes' for status, as fuzzy matching can be ambiguous with keywords.
        const statusMatch = order.status && order.status.toLowerCase().includes(term.toLowerCase());

        return fuzzyMatch(term, order.receiptNumber) ||
               fuzzyMatch(term, order.customerPhone) ||
               fuzzyMatch(term, order.type) ||
               statusMatch;
    });

    if (filteredOrders.length === 0) {
        noOrdersMessage.classList.remove('hidden');
         if (searchTerm) {
            noOrdersMessage.textContent = 'لا توجد طلبات تطابق معايير البحث.';
        } else if (agentOrders.length === 0) {
             noOrdersMessage.textContent = 'لا توجد طلبات لهذا المندوب حاليًا. قم بإضافة طلب جديد.';
        } else {
             noOrdersMessage.textContent = 'لا توجد طلبات تطابق معايير البحث.';
        }
    } else {
        noOrdersMessage.classList.add('hidden');
    }

    filteredOrders.forEach((order, index) => {
        const currentStatusEntry = order.statusHistory[order.statusHistory.length - 1];
        const currentStatus = currentStatusEntry.status;
        const latestStatusSpecificNote = currentStatusEntry.note;

        const statusClass = PREDEFINED_ORDER_STATUSES_DISPLAY[currentStatus] ?
                            `status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-')}` :
                            `status-custom status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-').toLowerCase()}`;

        let statusHtml = `<span class="status-badge ${statusClass}">${sanitizeHTML(currentStatus)}</span>`;
        if (latestStatusSpecificNote) {
            statusHtml += ` <small class="status-update-specific-note">${sanitizeHTML(latestStatusSpecificNote)}</small>`;
        }
        const priceDisplay = (order.price !== null && order.price !== undefined) ? formatNumber(Number(order.price), true) : '-';


        const row = ordersTableBody.insertRow();
        row.innerHTML = `
            <td>${formatNumber(index + 1)}</td>
            <td>${sanitizeHTML(order.type)}</td>
            <td>${sanitizeHTML(order.receiptNumber)}</td>
            <td>${sanitizeHTML(order.customerPhone)}</td>
            <td>${priceDisplay}</td>
            <td>${statusHtml}</td>
            <td>${sanitizeHTML(order.note || '-')}</td>
            <td>${formatDate(order.date)}</td>
            <td class="order-actions-cell">
                 <button class="action-menu-toggle open-order-actions-modal-btn"
                         aria-label="إجراءات الطلب ${sanitizeHTML(order.receiptNumber)}"
                         data-order-id="${order.id}"
                         data-agent-id="${agent.id}"
                         data-receipt-number="${sanitizeHTML(order.receiptNumber)}">&#8942;</button>
            </td>
        `;

        const orderActionsButton = row.querySelector('.open-order-actions-modal-btn');
        if (orderActionsButton) {
            (orderActionsButton as HTMLButtonElement).onclick = (e) => {
                e.stopPropagation();
                const orderId = parseInt((orderActionsButton as HTMLButtonElement).dataset.orderId!);
                const agentIdForRow = parseInt((orderActionsButton as HTMLButtonElement).dataset.agentId!);
                const receiptNumber = (orderActionsButton as HTMLButtonElement).dataset.receiptNumber!;
                openOrderActionsModal(agentIdForRow, orderId, receiptNumber);
            };
        }
    });

    agentsSection.classList.add('hidden');
    agentDetailsSection.classList.remove('hidden');

    if (!searchTerm) {
      agentDetailsSection.focus();
      window.scrollTo(0, 0);
    }
}


function showOrderHistory(agentId, orderId) {
    const agent = agents.find(d => d.id === agentId);
    if (!agent || !agent.orders) return;
    const order = agent.orders.find(o => o.id === orderId);
    if (!order) return;

    historyOrderReceiptNumberSpan.textContent = sanitizeHTML(order.receiptNumber);
    orderHistoryListUl.innerHTML = '';

    if (!order.statusHistory || order.statusHistory.length === 0) {
         noHistoryMessage.classList.remove('hidden');
         orderHistoryListUl.classList.add('hidden');
    } else {
         noHistoryMessage.classList.add('hidden');
         orderHistoryListUl.classList.remove('hidden');
        [...order.statusHistory].reverse().forEach(entry => {
            const li = document.createElement('li');
            let entryHtml = `<span class="history-status">${sanitizeHTML(entry.status)} (${entry.isActive ? 'نشط' : 'غير نشط'})</span>
                                     <span class="history-time">${formatDateTime(entry.timestamp)}</span>`;
            if (entry.note) {
                entryHtml += `<span class="history-note">ملاحظة: ${sanitizeHTML(entry.note)}</span>`;
            }
            li.innerHTML = entryHtml;
            orderHistoryListUl.appendChild(li);
        });
    }
    openModal(orderHistoryModal);
}

// --- Agent Expenses Modal Logic ---

function renderAgentExpenses(expenses, grouping = 'all') {
    agentExpensesContent.innerHTML = '';

    if (!expenses || expenses.length === 0) {
        agentExpensesContent.innerHTML = '<p id="no-expenses-message">لا توجد مصروفات مسجلة لهذا المندوب.</p>';
        return;
    }

    // Sort all expenses by date descending once
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (grouping === 'all') {
        let allExpensesHtml = '';
        sortedExpenses.forEach(expense => {
            allExpensesHtml += `
                <div class="expense-item">
                    <div class="expense-item-details">
                        <div class="expense-item-description">${sanitizeHTML(expense.description)}</div>
                        <div class="expense-item-date">${formatDateTime(expense.date)}</div>
                    </div>
                    <div class="expense-item-amount">${formatNumber(expense.amount, true)}</div>
                </div>
            `;
        });
        agentExpensesContent.innerHTML = allExpensesHtml;
    } else { // 'month' or 'year'
        const groupedExpenses = {};
        sortedExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const key = (grouping === 'month')
                ? date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' }) // YYYY-MM
                : date.getFullYear().toString(); // YYYY
            if (!groupedExpenses[key]) {
                groupedExpenses[key] = {
                    items: [],
                    total: 0
                };
            }
            groupedExpenses[key].items.push(expense);
            groupedExpenses[key].total += parseFloat(expense.amount || 0);
        });

        let groupedHtml = '';
        const sortedKeys = Object.keys(groupedExpenses).sort().reverse(); // Sort keys YYYY-MM or YYYY descending

        sortedKeys.forEach(key => {
            const group = groupedExpenses[key];
            const date = new Date(group.items[0].date); // Use first item's date to get year/month for title
            const groupTitle = (grouping === 'month')
                ? date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })
                : key;

            let itemsHtml = '';
            group.items.forEach(expense => {
                itemsHtml += `
                    <div class="expense-item">
                        <div class="expense-item-details">
                            <div class="expense-item-description">${sanitizeHTML(expense.description)}</div>
                            <div class="expense-item-date">${formatDateTime(expense.date)}</div>
                        </div>
                        <div class="expense-item-amount">${formatNumber(expense.amount, true)}</div>
                    </div>
                `;
            });

            groupedHtml += `
                <details class="expense-group">
                    <summary>
                        <span>${groupTitle}</span>
                        <span class="expense-group-total">الإجمالي: ${formatNumber(group.total, true)}</span>
                    </summary>
                    <div class="expense-group-items">
                        ${itemsHtml}
                    </div>
                </details>
            `;
        });
        agentExpensesContent.innerHTML = groupedHtml;
    }
}

function openAgentExpensesModal(agentId) {
    const agent = agents.find(d => d.id === agentId);
    if (!agent) return;

    expensesModalAgentNameSpan.textContent = sanitizeHTML(agent.name);

    // Set up control buttons
    expenseControlButtons.forEach(button => {
        button.onclick = (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const grouping = target.dataset.group;

            // Update active class
            expenseControlButtons.forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');

            // Re-render content
            renderAgentExpenses(agent.expenses, grouping);
        };
    });

    // Initial render (default to 'all')
    const initialActiveButton = document.querySelector('.expenses-controls-group button.active') || expenseControlButtons[0];
    const initialGrouping = (initialActiveButton as HTMLElement).dataset.group || 'all';
    renderAgentExpenses(agent.expenses, initialGrouping);

    openModal(agentExpensesModal);
}

// --- Action Menu Toggle Logic (for dropdowns like Agent Card menu) ---
function setupActionMenuToggleListeners() {
    document.querySelectorAll('.action-menu-toggle').forEach(toggle => {
        if (toggle.id === 'mainSettingsToggleBtn' || toggle.id === 'currentAgentActionToggleBtn' || toggle.classList.contains('open-order-actions-modal-btn')) {
            return;
        }

        const newToggle = toggle.cloneNode(true) as HTMLElement;
        toggle.parentNode!.replaceChild(newToggle, toggle);

        newToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const targetMenuId = newToggle.dataset.targetMenu;
            const menu = document.getElementById(targetMenuId!);

            document.querySelectorAll('.action-menu-content.show').forEach(openMenu => {
                if (openMenu.id !== targetMenuId) {
                    openMenu.classList.remove('show');
                }
            });
            if (menu) {
                menu.classList.toggle('show');
            }
        });
    });
}


// --- Order Actions Modal Logic (for actions on a specific order in table) ---
function openOrderActionsModal(agentId, orderId, receiptNumber) {
    orderActionsModalReceiptNumberSpan.textContent = sanitizeHTML(receiptNumber);
    orderActionsModalContentDiv.innerHTML = '';

    const currentAgent = agents.find(d => d.id === agentId);
    if (!currentAgent || !currentAgent.orders) return;
    const orderToUpdate = currentAgent.orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const updateBtn = document.createElement('button');
    updateBtn.className = 'table-action-button warning';
    updateBtn.textContent = 'تغيير الحالة';
    updateBtn.onclick = () => {
        closeModal(orderActionsModal);
        (document.getElementById('updateStatusOrderId') as HTMLInputElement).value = String(orderId);
        (document.getElementById('updateStatusAgentId') as HTMLInputElement).value = String(agentId);

        const latestStatusEntry = orderToUpdate.statusHistory[orderToUpdate.statusHistory.length -1];
        const currentStatus = latestStatusEntry.status;
        const currentIsActive = latestStatusEntry.isActive;

        populateStatusSelect(orderStatusSelect, currentStatus);
        newPriceForStatusUpdateInput.value = ''; // Clear previous value

        if (orderStatusSelect.value === CUSTOM_STATUS_OPTION_VALUE) {
            customStatusDiv.classList.remove('hidden');
            customOrderStatusText.value = currentStatus; // Populate custom text if it was a custom status
            customOrderStatusIsActiveCheckbox.checked = currentIsActive;

            newPriceForStatusUpdateDiv.classList.remove('hidden');
            newPriceForStatusUpdateInput.placeholder = "ادخل السعر الجديد (اختياري)";
            newPriceForStatusUpdateInput.required = false;
        } else if (orderStatusSelect.value === STATUS_PARTIAL) {
            customStatusDiv.classList.add('hidden');
            customOrderStatusText.value = '';

            newPriceForStatusUpdateDiv.classList.remove('hidden');
            newPriceForStatusUpdateInput.placeholder = "ادخل السعر الجديد";
            newPriceForStatusUpdateInput.required = true;
        } else {
            customStatusDiv.classList.add('hidden');
            customOrderStatusText.value = '';
            newPriceForStatusUpdateDiv.classList.add('hidden');
            newPriceForStatusUpdateInput.required = false;
        }
        statusUpdateNoteTextarea.value = '';
        openModal(updateStatusModal);
    };
    orderActionsModalContentDiv.appendChild(updateBtn);

    const historyBtn = document.createElement('button');
    historyBtn.className = 'table-action-button info';
    historyBtn.textContent = 'تفاصيل السجل';
    historyBtn.onclick = () => {
        closeModal(orderActionsModal);
        showOrderHistory(agentId, orderId);
    };
    orderActionsModalContentDiv.appendChild(historyBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'table-action-button danger';
    deleteBtn.textContent = 'حذف الطلب';
    deleteBtn.onclick = () => {
        orderToDeleteAgentId = agentId;
        orderToDeleteOrderId = orderId;
        closeModal(orderActionsModal);
        openModal(deleteOrderConfirmModal);
    };
    orderActionsModalContentDiv.appendChild(deleteBtn);

    openModal(orderActionsModal);
}

confirmDeleteOrderBtn.onclick = () => {
    if (orderToDeleteAgentId !== null && orderToDeleteOrderId !== null) {
        deleteOrder(orderToDeleteAgentId, orderToDeleteOrderId);
        orderToDeleteAgentId = null;
        orderToDeleteOrderId = null;
    }
    closeModal(deleteOrderConfirmModal);
};

cancelDeleteOrderBtn.onclick = () => {
    orderToDeleteAgentId = null;
    orderToDeleteOrderId = null;
    closeModal(deleteOrderConfirmModal);
};

// --- Event Handlers for main actions ---

mainSettingsToggleBtn.onclick = () => {
    const hasData = agents.length > 0;
    exportReportBtnInSettings.classList.toggle('hidden', !hasData);
    exportGlobalOrdersPDFBtn.classList.toggle('hidden', !hasData);
    exportGlobalOrdersNonDeliveredPDFBtn.classList.toggle('hidden', !hasData);
    exportDataBtnInSettings.classList.toggle('hidden', !hasData);
    deleteAllAgentsBtnInSettings.classList.toggle('hidden', !hasData);

    addAgentBtnInSettings.classList.remove('hidden');
    importDataLabelInSettings.classList.remove('hidden');

    openModal(mainSettingsModal);
};

currentAgentActionToggleBtn.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (agent) {
        currentAgentActionsModalTitle.textContent = `إجراءات المندوب: ${sanitizeHTML(agent.name)}`;
        const hasOrders = agent.orders && agent.orders.length > 0;
        exportAgentOrdersPDFBtnInModal.disabled = !hasOrders;
        exportAgentOrdersNonDeliveredPDFBtnInModal.disabled = !hasOrders;
        deleteAllOrdersForCurrentAgentBtnInModal.disabled = !hasOrders;
        openModal(currentAgentActionsModal);
    }
};


addAgentBtnInSettings.onclick = () => {
    addAgentForm.reset();
    openModal(addAgentModal);
    closeModal(mainSettingsModal);
};

exportReportBtnInSettings.onclick = () => {
    exportReportToCSV();
    closeModal(mainSettingsModal);
};
exportDataBtnInSettings.onclick = () => {
    exportDataToJson();
    closeModal(mainSettingsModal);
};
deleteAllAgentsBtnInSettings.onclick = () => {
    handleDeleteAllAgents();
    closeModal(mainSettingsModal);
};


addAgentForm.onsubmit = (e) => {
    e.preventDefault();
    const name = (document.getElementById('agentName') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('agentPhone') as HTMLInputElement).value.trim();
    const area = (document.getElementById('agentArea') as HTMLInputElement).value.trim();
    const deliveryFeeInput = (document.getElementById('agentDeliveryFee') as HTMLInputElement).value.trim();
    const deliveryFee = deliveryFeeInput ? parseFloat(deliveryFeeInput) : 0;


    if (name && phone && area && deliveryFeeInput && !isNaN(deliveryFee) && deliveryFee >=0) {
        agents.push({ id: nextAgentId++, name, phone, area, deliveryFee, orders: [], expenses: [] });
        saveData();
        renderAgentsList();
        closeModal(addAgentModal);
    } else {
        alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح. يجب أن تكون أجور التوصيل رقمًا صالحًا.");
    }
};

// --- Edit Agent Logic ---
editCurrentAgentBtnInModal.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (agent) {
        (document.getElementById('editAgentId') as HTMLInputElement).value = String(agent.id);
        (document.getElementById('editAgentName') as HTMLInputElement).value = agent.name;
        (document.getElementById('editAgentPhone') as HTMLInputElement).value = agent.phone;
        (document.getElementById('editAgentArea') as HTMLInputElement).value = agent.area;
        (document.getElementById('editAgentDeliveryFee') as HTMLInputElement).value = String(agent.deliveryFee);
        openModal(editAgentModal);
        closeModal(currentAgentActionsModal);
    }
};

editAgentForm.onsubmit = (e) => {
    e.preventDefault();
    const agentId = parseInt((document.getElementById('editAgentId') as HTMLInputElement).value);
    const name = (document.getElementById('editAgentName') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('editAgentPhone') as HTMLInputElement).value.trim();
    const area = (document.getElementById('editAgentArea') as HTMLInputElement).value.trim();
    const deliveryFeeInput = (document.getElementById('editAgentDeliveryFee') as HTMLInputElement).value.trim();
    const deliveryFee = deliveryFeeInput ? parseFloat(deliveryFeeInput) : 0;

    if (agentId && name && phone && area && deliveryFeeInput && !isNaN(deliveryFee) && deliveryFee >= 0) {
        const agentIndex = agents.findIndex(d => d.id === agentId);
        if (agentIndex > -1) {
            agents[agentIndex].name = name;
            agents[agentIndex].phone = phone;
            agents[agentIndex].area = area;
            agents[agentIndex].deliveryFee = deliveryFee;
            saveData();
            renderAgentDetails(agentId, searchInput.value); // Re-render current view
            renderAgentsList(); // Re-render list if name/etc changed
            closeModal(editAgentModal);
        }
    } else {
        alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح. يجب أن تكون أجور التوصيل رقمًا صالحًا.");
    }
};

// --- Add Expense Logic ---
addExpenseForCurrentAgentBtnInModal.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (agent) {
        addExpenseForm.reset();
        (document.getElementById('expenseAgentId') as HTMLInputElement).value = String(agent.id);
        addExpenseModalAgentNameSpan.textContent = sanitizeHTML(agent.name);
        openModal(addExpenseModal);
        closeModal(currentAgentActionsModal);
    }
};

addExpenseForm.onsubmit = (e) => {
    e.preventDefault();
    const agentId = parseInt((document.getElementById('expenseAgentId') as HTMLInputElement).value);
    const amountInput = (document.getElementById('expenseAmount') as HTMLInputElement).value.trim();
    const description = (document.getElementById('expenseDescription') as HTMLInputElement).value.trim();
    const amount = parseFloat(amountInput);

    if (agentId && amountInput && !isNaN(amount) && amount > 0 && description) {
        const agent = agents.find(d => d.id === agentId);
        if (agent) {
            if (!agent.expenses) agent.expenses = [];
            agent.expenses.push({
                id: nextExpenseId++,
                amount: amount,
                description: description,
                date: new Date().toISOString()
            });
            saveData();
            renderAgentDetails(agentId, searchInput.value); // Re-render details to show new expense and updated net
            renderGlobalStats(); // Update global stats as well
            closeModal(addExpenseModal);
        }
    } else {
        alert("يرجى إدخال مبلغ صحيح ووصف للمصروف.");
    }
};


showAddOrderModalBtn.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (agent) {
        addOrderForm.reset();
        (document.getElementById('orderAgentId') as HTMLInputElement).value = String(agent.id);
        addOrderModalAgentNameSpan.textContent = sanitizeHTML(agent.name);
        openModal(addOrderModal);
    }
};

addOrderForm.onsubmit = (e) => {
    e.preventDefault();
    const agentId = parseInt((document.getElementById('orderAgentId') as HTMLInputElement).value);
    const companyName = (document.getElementById('orderType') as HTMLInputElement).value.trim(); // Changed from clientName
    const receiptNumber = (document.getElementById('receiptNumber') as HTMLInputElement).value.trim();
    const customerPhone = (document.getElementById('customerPhone') as HTMLInputElement).value.trim();
    const priceInput = (document.getElementById('orderPrice') as HTMLInputElement).value.trim();
    const price = priceInput ? parseFloat(priceInput) : null;
    const notes = (document.getElementById('orderNote') as HTMLTextAreaElement).value.trim();
    const creationTime = new Date().toISOString();

    if (agentId && companyName && receiptNumber && customerPhone) {
        const agent = agents.find(d => d.id === agentId);
        if (agent) {
            if (!agent.orders) agent.orders = [];
            const initialIsActive = !INACTIVE_STATUSES_PREDEFINED.includes(DEFAULT_ORDER_STATUS);
            const newOrder = {
                id: nextOrderId++,
                type: companyName, // Storing company name in 'type' field
                receiptNumber,
                customerPhone,
                price: price,
                status: DEFAULT_ORDER_STATUS,
                note: notes,
                date: creationTime,
                statusHistory: [{
                    status: DEFAULT_ORDER_STATUS,
                    timestamp: creationTime,
                    note: "",
                    isActive: initialIsActive
                }]
            };
            agent.orders.push(newOrder);
            saveData();
            renderAgentDetails(agentId, searchInput.value);
            renderAgentsList(); // Also re-render agent list to update its summary
            closeModal(addOrderModal);
        }
    }
};

updateStatusForm.onsubmit = (e) => {
    e.preventDefault();
    const orderId = parseInt((document.getElementById('updateStatusOrderId') as HTMLInputElement).value);
    const agentId = parseInt((document.getElementById('updateStatusAgentId') as HTMLInputElement).value);
    const statusFromDropdown = orderStatusSelect.value;
    const customStatusValue = customOrderStatusText.value.trim();

    let finalStatus;
    let isActive;

    if (statusFromDropdown === CUSTOM_STATUS_OPTION_VALUE) {
        if (!customStatusValue) {
            alert("الرجاء إدخال نص الحالة المخصصة أو اختيار حالة من القائمة.");
            customOrderStatusText.focus();
            return;
        }
        finalStatus = customStatusValue;
        isActive = customOrderStatusIsActiveCheckbox.checked;

        // Add the new custom status to our list if it doesn't already exist or update its active state
        const existingCustomStatus = customOrderStatuses.find(cs => cs.name.toLowerCase() === finalStatus.toLowerCase());
        if (!existingCustomStatus) {
            customOrderStatuses.push({ name: finalStatus, isActive: isActive });
        } else if (existingCustomStatus.isActive !== isActive) {
            // Update the default 'isActive' state for this custom status if user changes it
            existingCustomStatus.isActive = isActive;
        }
    } else {
        finalStatus = statusFromDropdown;

        // Determine isActive property for the selected status
        const customStatus = customOrderStatuses.find(cs => cs.name === finalStatus);
        if (customStatus) {
            isActive = customStatus.isActive;
        } else {
            // It's a predefined status
            isActive = !INACTIVE_STATUSES_PREDEFINED.includes(finalStatus);
        }
    }

    const agent = agents.find(d => d.id === agentId);
    if (agent && agent.orders) {
        const order = agent.orders.find(o => o.id === orderId);
        if (order) {
            let userEnteredNote = statusUpdateNoteTextarea.value.trim();
            let autoGeneratedPriceNote = "";
            const newPriceValue = newPriceForStatusUpdateInput.value.trim();

            if ((finalStatus === STATUS_PARTIAL || (orderStatusSelect.value === CUSTOM_STATUS_OPTION_VALUE && newPriceValue)) && newPriceValue) {
                const parsedNewPrice = parseFloat(newPriceValue);
                if (isNaN(parsedNewPrice) || parsedNewPrice < 0) {
                    alert("السعر الجديد غير صالح. الرجاء إدخال رقم موجب.");
                    newPriceForStatusUpdateInput.focus();
                    return;
                }
                const oldPrice = order.price;
                order.price = parsedNewPrice; // Update order's main price
                autoGeneratedPriceNote = `تغيير السعر - القديم: ${formatNumber(oldPrice, true)}، الجديد: ${formatNumber(parsedNewPrice, true)}.`;
            } else if (finalStatus === STATUS_PARTIAL && !newPriceValue) {
                alert("لحالة 'واصل جزئي'، يجب إدخال السعر الجديد.");
                newPriceForStatusUpdateInput.focus();
                return;
            }

            let finalHistoryNote = autoGeneratedPriceNote;
            if (userEnteredNote) {
                if (finalHistoryNote) {
                    finalHistoryNote += "\\n" + userEnteredNote;
                } else {
                    finalHistoryNote = userEnteredNote;
                }
            }

            if (!order.statusHistory) order.statusHistory = [];
            order.statusHistory.push({
                status: finalStatus,
                timestamp: new Date().toISOString(),
                note: finalHistoryNote,
                isActive: isActive
            });
            order.status = finalStatus; // Update current status shorthand

            saveData();
            renderAgentDetails(agentId, searchInput.value);
            renderAgentsList(); // Also re-render agent list to update its summary
            closeModal(updateStatusModal);

            // Reset modal fields
            customStatusDiv.classList.add('hidden');
            customOrderStatusText.value = '';
            customOrderStatusIsActiveCheckbox.checked = true;
            newPriceForStatusUpdateDiv.classList.add('hidden');
            newPriceForStatusUpdateInput.value = '';
            statusUpdateNoteTextarea.value = '';
        }
    }
};


function backToAgentsList() {
    currentlyViewingAgentId = null;
    agentDetailsSection.classList.add('hidden');
    agentsSection.classList.remove('hidden');
    searchInput.value = '';
    document.getElementById('current-agent-action-menu-container-wrapper')!.classList.add('hidden');
    agentsSection.focus();
    window.scrollTo(0, 0);
}

backToAgentsListBtn.onclick = backToAgentsList;

searchInput.oninput = () => {
    if (currentlyViewingAgentId !== null) {
        renderAgentDetails(currentlyViewingAgentId, searchInput.value);
    }
};

function showAgentDetails(agentId) {
    searchInput.value = '';
    renderAgentDetails(agentId);
}

// --- Delete Functions ---
function deleteAgent(agentId) {
    const agent = agents.find(d => d.id === agentId);
    if (!agent) return;
    if (window.confirm(`هل أنت متأكد أنك تريد حذف المندوب "${sanitizeHTML(agent.name)}" وجميع طلباته ومصروفاته؟`)) {
        agents = agents.filter(d => d.id !== agentId);
        saveData();
        if (currentlyViewingAgentId === agentId) {
            backToAgentsList();
        }
        renderAgentsList();
    }
}

function deleteOrder(agentId, orderId) {
    const agent = agents.find(d => d.id === agentId);
    if (!agent || !agent.orders) return;
    const order = agent.orders.find(o => o.id === orderId);
    if(!order) return;

    agent.orders = agent.orders.filter(o => o.id !== orderId);
    saveData();
    renderAgentDetails(agentId, searchInput.value);
    renderAgentsList(); // Also re-render agent list to update its summary
}

function handleDeleteAllAgents() {
    if (agents.length === 0) {
        alert("لا يوجد مندوبون لحذفهم.");
        return;
    }
    if (window.confirm("هل أنت متأكد أنك تريد حذف جميع المندوبين وجميع طلباتهم ومصروفاتهم؟ لا يمكن التراجع عن هذا الإجراء.")) {
        agents = [];
        nextAgentId = 1;
        nextOrderId = 1;
        nextExpenseId = 1;
        saveData();
        if (agentDetailsSection.classList.contains('hidden') === false) {
            backToAgentsList();
        }
        renderAgentsList();
    }
}

// --- Export CSV Function ---
function exportReportToCSV() {
    if (agents.length === 0) {
        alert("لا يوجد بيانات لتصديرها كتقرير CSV.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const header = [
        "اسم المندوب", "هاتف المندوب", "منطقة المندوب", "أجرة التوصيل للطلب", "إجمالي مصروفات المندوب",
        "رقم تسلسلي للطلب", "الشركة", "رقم الوصل", "هاتف الزبون", "السعر",
        "الحالة الحالية", "هل الطلب نشط؟", "ملاحظة الحالة الأخيرة", "الملاحظات العامة للطلب", "تاريخ إنشاء الطلب",
        "سجل تغييرات الحالة"
    ];
    csvContent += header.join(",") + "\\r\\n";

    agents.forEach(agent => {
        const agentDeliveryFee = (agent.deliveryFee || 0).toString();
        let totalAgentExpenses = 0;
        if(agent.expenses) {
            agent.expenses.forEach(exp => totalAgentExpenses += (parseFloat(exp.amount) || 0));
        }

        if (agent.orders && agent.orders.length > 0) {
            agent.orders.forEach((order, index) => {
                const currentStatusEntry = order.statusHistory[order.statusHistory.length - 1];
                const currentStatus = currentStatusEntry.status;
                const currentIsActive = currentStatusEntry.isActive ? "نعم" : "لا";
                const latestStatusSpecificNote = currentStatusEntry.note;
                const priceValue = (order.price !== null && order.price !== undefined) ? (Number(order.price) || 0).toString() : "";


                const historyEntries = order.statusHistory.map(h =>
                    `"${h.status.replace(/"/g, '""')} (${h.isActive ? 'نشط' : 'غير نشط'} - ${formatDateTime(h.timestamp)})${h.note ? ' - ملاحظة: ' + h.note.replace(/"/g, '""') : ''}"`
                ).join(" | ");

                const row = [
                    `"${agent.name.replace(/"/g, '""')}"`,
                    `"${agent.phone}"`,
                    `"${agent.area.replace(/"/g, '""')}"`,
                    `"${agentDeliveryFee}"`,
                    `"${totalAgentExpenses.toString()}"`, // Include total expenses for agent only on first order row or always?
                    formatNumber(index + 1),
                    `"${order.type.replace(/"/g, '""')}"`,
                    `"${order.receiptNumber.replace(/"/g, '""')}"`,
                    `"${order.customerPhone.replace(/"/g, '""')}"`,
                    `"${priceValue}"`,
                    `"${currentStatus.replace(/"/g, '""')}"`,
                    `"${currentIsActive}"`,
                    `"${latestStatusSpecificNote.replace(/"/g, '""')}"`,
                    `"${(order.note || '').replace(/"/g, '""')}"`,
                    `"${formatDateTime(order.date)}"`,
                    `"${historyEntries}"`
                ];
                csvContent += row.join(",") + "\\r\\n";
            });
        } else {
            const row = [
                `"${agent.name.replace(/"/g, '""')}"`,
                `"${agent.phone}"`,
                `"${agent.area.replace(/"/g, '""')}"`,
                `"${agentDeliveryFee}"`,
                `"${totalAgentExpenses.toString()}"`,
                "لا توجد طلبات", "", "", "", "", "", "", "", "", "", ""
            ];
            csvContent += row.join(",") + "\\r\\n";
        }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const reportDate = new Date();
    const filename = `تقرير_الطلبات_${reportDate.getFullYear()}-${String(reportDate.getMonth()+1).padStart(2,'0')}-${String(reportDate.getDate()).padStart(2,'0')}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// --- JSON Data Import/Export ---
function exportDataToJson() {
    if (agents.length === 0 && nextAgentId === 1 && nextOrderId === 1 && nextExpenseId === 1 && pdfGenerationCounter === 0) {
        alert("لا توجد بيانات لتصديرها.");
        return;
    }
    const dataToExport = {
        agents: agents,
        nextAgentId: nextAgentId,
        nextOrderId: nextOrderId,
        nextExpenseId: nextExpenseId,
        pdfGenerationCounter: pdfGenerationCounter,
        customOrderStatuses: customOrderStatuses
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], {type: "application/json;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const exportDate = new Date();
    const filename = `prototype_backup_${exportDate.getFullYear()}-${String(exportDate.getMonth()+1).padStart(2,'0')}-${String(exportDate.getDate()).padStart(2,'0')}.json`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


importDataInput.onchange = (event) => {
    // Fix: Cast event.target to HTMLInputElement to access files property.
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // Fix: Cast FileReader result to string before parsing.
                const importedData = JSON.parse(e.target!.result as string);
                if (importedData && Array.isArray(importedData.agents) &&
                    typeof importedData.nextAgentId === 'number' &&
                    typeof importedData.nextOrderId === 'number') { // nextExpenseId can be optional for backward compat

                    if (window.confirm("هل أنت متأكد أنك تريد استيراد هذه البيانات؟ سيتم استبدال جميع البيانات الحالية.")) {
                        // Fix: Cast FileReader result to string for localStorage.
                        localStorage.setItem(AGENTS_STORAGE_KEY, e.target!.result as string);
                        loadData();
                        renderAgentsList();
                        if(!agentDetailsSection.classList.contains('hidden')){
                            backToAgentsList();
                        }
                        alert("تم استيراد البيانات بنجاح!");
                    }
                } else {
                    alert("ملف JSON غير صالح أو لا يحتوي على البنية المتوقعة.");
                }
            } catch (err) {
                console.error("Error importing data:", err);
                alert("حدث خطأ أثناء قراءة أو معالجة ملف JSON. تأكد أن الملف بتنسيق UTF-8.");
            } finally {
                importDataInput.value = '';
                closeModal(mainSettingsModal);
            }
        };
        reader.onerror = () => {
            alert("حدث خطأ أثناء قراءة الملف.");
            importDataInput.value = '';
            closeModal(mainSettingsModal);
        };
        reader.readAsText(file, "UTF-8");
    }
};

// --- Global Search Functionality ---
function performGlobalSearch(searchTerm) {
    const results = [];
    const term = searchTerm.trim();
    if (!term) {
        return results;
    }

    agents.forEach(agent => {
        if (agent.orders && agent.orders.length > 0) {
            agent.orders.forEach(order => {
                const match = fuzzyMatch(term, order.receiptNumber) ||
                              fuzzyMatch(term, order.customerPhone) ||
                              fuzzyMatch(term, order.type);
                if (match) {
                    results.push({ ...order, agentName: agent.name });
                }
            });
        }
    });
    return results;
}

function renderGlobalSearchResults(results) {
    globalSearchResultsTableBody.innerHTML = '';
    if (results.length === 0) {
        noGlobalSearchResultsMessage.classList.remove('hidden');
        globalSearchResultsTableBody.classList.add('hidden');
    } else {
        noGlobalSearchResultsMessage.classList.add('hidden');
        globalSearchResultsTableBody.classList.remove('hidden');
        results.forEach(order => {
            const currentStatusEntry = order.statusHistory[order.statusHistory.length - 1];
            const currentStatus = currentStatusEntry.status;
            const latestStatusSpecificNote = currentStatusEntry.note;

            const statusClass = PREDEFINED_ORDER_STATUSES_DISPLAY[currentStatus] ?
                                        `status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-')}` :
                                        `status-custom status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-').toLowerCase()}`;

            let statusHtml = `<span class="status-badge ${statusClass}">${sanitizeHTML(currentStatus)}</span>`;
            if (latestStatusSpecificNote) {
                statusHtml += ` <small class="status-update-specific-note">${sanitizeHTML(latestStatusSpecificNote)}</small>`;
            }
            const priceDisplay = (order.price !== null && order.price !== undefined) ? formatNumber(Number(order.price), true) : '-';

            const row = globalSearchResultsTableBody.insertRow();
            row.innerHTML = `
                <td>${sanitizeHTML(order.agentName)}</td>
                <td>${sanitizeHTML(order.type)}</td>
                <td>${sanitizeHTML(order.receiptNumber)}</td>
                <td>${sanitizeHTML(order.customerPhone)}</td>
                <td>${priceDisplay}</td>
                <td>${statusHtml}</td>
                <td>${sanitizeHTML(order.note || '-')}</td>
                <td>${formatDate(order.date)}</td>
            `;
        });
    }
    openModal(globalSearchResultsModal);
}

function handleGlobalSearch() {
    const searchTerm = globalSearchInput.value.trim();
    if (!searchTerm) {
        if (globalSearchResultsModal.style.display === 'flex') {
            closeModal(globalSearchResultsModal);
        }
        return;
    }
    const results = performGlobalSearch(searchTerm);
    renderGlobalSearchResults(results);
}

globalSearchBtn.onclick = handleGlobalSearch;

// --- PDF Export Functions ---

function calculatePdfFinancials(ordersForPdf, agentDeliveryFee, agentTotalExpenses = 0) {
    let totalCollected = 0;
    let collectedOrPartiallyCollectedOrdersCount = 0;
    let deliveredOrdersCount = 0;
    let partialOrdersCount = 0;
    let activeOrdersCount = 0;

    ordersForPdf.forEach(order => {
        const latestStatusEntry = order.statusHistory[order.statusHistory.length - 1];
        const currentStatus = latestStatusEntry.status;

        if (currentStatus === STATUS_DELIVERED) {
            deliveredOrdersCount++;
            if (order.price != null && !isNaN(parseFloat(order.price))) {
                totalCollected += parseFloat(order.price);
            }
            collectedOrPartiallyCollectedOrdersCount++;
        } else if (currentStatus === STATUS_PARTIAL) {
            partialOrdersCount++;
            if (order.price != null && !isNaN(parseFloat(order.price))) {
                totalCollected += parseFloat(order.price);
            }
            collectedOrPartiallyCollectedOrdersCount++;
        }
        if (latestStatusEntry.isActive) {
            activeOrdersCount++;
        }
    });

    const totalFees = collectedOrPartiallyCollectedOrdersCount * (parseFloat(agentDeliveryFee) || 0);
    const netAmount = totalCollected - totalFees - agentTotalExpenses; // Subtract expenses

    return {
        totalCollected: totalCollected,
        totalFees: totalFees,
        agentTotalExpenses: agentTotalExpenses,
        netAmount: netAmount,
        totalOrdersInPdf: ordersForPdf.length,
        deliveredOrdersInPdf: deliveredOrdersCount,
        partialOrdersInPdf: partialOrdersCount,
        activeOrdersInPdf: activeOrdersCount
    };
}


function generatePrintMetaHeaderHtml(sequence, dateTime) {
    return `
                <div class="print-meta-header">
                    <p>تسلسل الكشف: <span>${formatNumber(sequence)}</span></p>
                    <p>تاريخ و وقت الطباعة: <span>${sanitizeHTML(dateTime)}</span></p>
                </div>`;
}

function generatePrintFinancialSummaryHtml(financials) {
     return `
                <div class="print-financial-summary">
                    <h3>ملخص الكشف الحالي</h3>
                    <p>إجمالي المبلغ المحصل (في هذا الكشف): <span>${formatNumber(financials.totalCollected, true)}</span></p>
                    <p>إجمالي أجور التوصيل (في هذا الكشف): <span>${formatNumber(financials.totalFees, true)}</span></p>
                    <p>إجمالي المصروفات الإضافية: <span>${formatNumber(financials.agentTotalExpenses, true)}</span></p>
                    <p>الصافي بعد الأجور والمصروفات (في هذا الكشف): <span>${formatNumber(financials.netAmount, true)}</span></p>
                    <hr style="border: none; border-top: 1px dashed #ccc; margin: 5px 0;">
                    <p>إجمالي الطلبات (في هذا الكشف): <span>${formatNumber(financials.totalOrdersInPdf)}</span></p>
                    <p>الطلبات المسلمة (في هذا الكشف): <span>${formatNumber(financials.deliveredOrdersInPdf)}</span></p>
                    <p>الطلبات الواصلة جزئياً (في هذا الكشف): <span>${formatNumber(financials.partialOrdersInPdf)}</span></p>
                    <p>الطلبات النشطة (في هذا الكشف): <span>${formatNumber(financials.activeOrdersInPdf)}</span></p>
                </div>`;
}
 function generateGlobalReportAgentFinancialSummaryHtml(financials) {
     return `
                <div class="print-financial-summary-global">
                    <h4>ملخص هذا المندوب في الكشف الحالي</h4>
                    <p>إجمالي المبلغ المحصل: <span>${formatNumber(financials.totalCollected, true)}</span></p>
                    <p>إجمالي أجور التوصيل: <span>${formatNumber(financials.totalFees, true)}</span></p>
                    <p>إجمالي المصروفات الإضافية: <span>${formatNumber(financials.agentTotalExpenses, true)}</span></p>
                    <p>الصافي بعد الأجور والمصروفات: <span>${formatNumber(financials.netAmount, true)}</span></p>
                    <hr style="border: none; border-top: 1px dashed #ccc; margin: 5px 0;">
                    <p>إجمالي الطلبات: <span>${formatNumber(financials.totalOrdersInPdf)}</span></p>
                    <p>الطلبات المسلمة: <span>${formatNumber(financials.deliveredOrdersInPdf)}</span></p>
                    <p>الطلبات الواصلة جزئياً: <span>${formatNumber(financials.partialOrdersInPdf)}</span></p>
                    <p>الطلبات النشطة: <span>${formatNumber(financials.activeOrdersInPdf)}</span></p>
                </div>`;
}


function triggerPrint(mainReportTitle, bodyClass) {
    pdfGenerationCounter++;
    saveData();

    document.documentElement.style.setProperty('--print-title', `"${mainReportTitle}"`);
    document.body.classList.add(bodyClass);

    setTimeout(() => {
        window.print();
    }, 100);
}

window.onafterprint = () => {
    document.body.classList.remove('printing-agent-details', 'printing-global-report');
    document.documentElement.style.removeProperty('--print-title');
    if (globalPdfReportContentDiv) globalPdfReportContentDiv.innerHTML = '';
    if (agentDetailsPrintMetaPlaceholder) agentDetailsPrintMetaPlaceholder.innerHTML = '';
    if (agentDetailsPrintFinancialSummaryPlaceholder) agentDetailsPrintFinancialSummaryPlaceholder.innerHTML = '';
    if (currentlyViewingAgentId !== null) {
        renderAgentDetails(currentlyViewingAgentId, searchInput.value);
    }
};

function generateOrdersTableHtml(ordersToPrint) {
    let tableHtml = `<div class="table-responsive-wrapper"><table>
                                <thead><tr>
                                    <th>#</th>
                                    <th>الشركة</th>
                                    <th>رقم الوصل</th>
                                    <th>هاتف الزبون</th>
                                    <th>السعر</th>
                                    <th>الحالة</th>
                                    <th>الملاحظات</th>
                                    <th>تاريخ الإضافة</th>
                                </tr></thead><tbody>`;
    if (ordersToPrint.length === 0) {
        tableHtml += `<tr><td colspan="8" style="text-align:center;">لا توجد طلبات لعرضها في هذا الكشف.</td></tr>`;
    } else {
        ordersToPrint.forEach((order, index) => {
            const currentStatusEntry = order.statusHistory[order.statusHistory.length - 1];
            const currentStatus = currentStatusEntry.status;
            const latestStatusSpecificNote = currentStatusEntry.note;
            const statusClass = PREDEFINED_ORDER_STATUSES_DISPLAY[currentStatus] ?
                                        `status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-')}` :
                                        `status-custom status-${sanitizeHTML(currentStatus).replace(/\s+/g, '-').toLowerCase()}`;
            let statusHtml = `<span class="status-badge ${statusClass}">${sanitizeHTML(currentStatus)}</span>`;
            if (latestStatusSpecificNote) {
                statusHtml += ` <small class="status-update-specific-note">${sanitizeHTML(latestStatusSpecificNote)}</small>`;
            }
            const priceDisplay = (order.price !== null && order.price !== undefined) ? formatNumber(Number(order.price), true) : '-';

            tableHtml += `<tr>
                                    <td>${formatNumber(index + 1)}</td>
                                    <td>${sanitizeHTML(order.type)}</td>
                                    <td>${sanitizeHTML(order.receiptNumber)}</td>
                                    <td>${sanitizeHTML(order.customerPhone)}</td>
                                    <td>${priceDisplay}</td>
                                    <td>${statusHtml}</td>
                                    <td>${sanitizeHTML(order.note || '-')}</td>
                                    <td>${formatDate(order.date)}</td>
                                 </tr>`;
        });
    }
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
}


// Agent PDF - All Orders
exportAgentOrdersPDFBtnInModal.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (!agent || !agent.orders || agent.orders.length === 0) {
        alert("لا توجد طلبات لهذا المندوب لتصديرها.");
        closeModal(currentAgentActionsModal);
        return;
    }

    const ordersToPrint = [...agent.orders];
    let agentTotalExpenses = 0;
    if(agent.expenses) {
        agent.expenses.forEach(exp => agentTotalExpenses += (parseFloat(exp.amount) || 0));
    }
    const financials = calculatePdfFinancials(ordersToPrint, agent.deliveryFee, agentTotalExpenses);
    const printDateTime = getFormattedDateTimeForPrint();

    agentDetailsPrintMetaPlaceholder.innerHTML = generatePrintMetaHeaderHtml(pdfGenerationCounter + 1, printDateTime);
    agentDetailsPrintFinancialSummaryPlaceholder.innerHTML = generatePrintFinancialSummaryHtml(financials);
    ordersTableBody.innerHTML = generateOrdersTableHtml(ordersToPrint).match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)![1];
    noOrdersMessage.classList.add('hidden');


    triggerPrint(`تقرير طلبات المندوب: ${sanitizeHTML(agent.name)}`, 'printing-agent-details');
    closeModal(currentAgentActionsModal);
};

// Agent PDF - Non-Delivered Orders
exportAgentOrdersNonDeliveredPDFBtnInModal.onclick = () => {
    if (currentlyViewingAgentId === null) return;
    const agent = agents.find(d => d.id === currentlyViewingAgentId);
    if (!agent || !agent.orders || agent.orders.length === 0) {
        alert("لا توجد طلبات لهذا المندوب لتصديرها.");
        closeModal(currentAgentActionsModal);
        return;
    }

    const ordersToPrint = agent.orders.filter(order => order.statusHistory[order.statusHistory.length - 1].status !== STATUS_DELIVERED);
    if (ordersToPrint.length === 0) {
        alert("لا توجد طلبات غير مسلمة لهذا المندوب.");
        closeModal(currentAgentActionsModal);
        return;
    }

    let agentTotalExpenses = 0;
    if(agent.expenses) {
        agent.expenses.forEach(exp => agentTotalExpenses += (parseFloat(exp.amount) || 0));
    }
    const financials = calculatePdfFinancials(ordersToPrint, agent.deliveryFee, agentTotalExpenses);
    const printDateTime = getFormattedDateTimeForPrint();

    agentDetailsPrintMetaPlaceholder.innerHTML = generatePrintMetaHeaderHtml(pdfGenerationCounter + 1, printDateTime);
    agentDetailsPrintFinancialSummaryPlaceholder.innerHTML = generatePrintFinancialSummaryHtml(financials);
    ordersTableBody.innerHTML = generateOrdersTableHtml(ordersToPrint).match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)![1];
    noOrdersMessage.classList.add('hidden');

    triggerPrint(`تقرير الطلبات (عدا المسلم) للمندوب: ${sanitizeHTML(agent.name)}`, 'printing-agent-details');
    closeModal(currentAgentActionsModal);
};


deleteAllOrdersForCurrentAgentBtnInModal.onclick = () => {
    if (currentlyViewingAgentId !== null) {
        const agent = agents.find(d => d.id === currentlyViewingAgentId);
        if (agent && agent.orders && agent.orders.length > 0) {
            if (window.confirm(`هل أنت متأكد أنك تريد حذف جميع طلبات المندوب "${sanitizeHTML(agent.name)}؟"`)) {
                agent.orders = [];
                saveData();
                renderAgentDetails(currentlyViewingAgentId, searchInput.value);
                renderAgentsList(); // Also re-render agent list to update its summary
            }
        } else {
            alert("لا توجد طلبات لحذفها لهذا المندوب.");
        }
    }
    closeModal(currentAgentActionsModal);
};

deleteCurrentAgentBtnInModal.onclick = () => {
    if (currentlyViewingAgentId !== null) {
        deleteAgent(currentlyViewingAgentId);
    }
    closeModal(currentAgentActionsModal);
};


// Global PDF - All Orders
exportGlobalOrdersPDFBtn.onclick = () => {
    if (agents.length === 0) {
        alert("لا يوجد بيانات لتصديرها كملف PDF.");
        closeModal(mainSettingsModal);
        return;
    }
    let reportHtml = generatePrintMetaHeaderHtml(pdfGenerationCounter + 1, getFormattedDateTimeForPrint());
    let hasAnyOrder = false;

    agents.forEach(agent => {
        const ordersToPrint = agent.orders && agent.orders.length > 0 ? [...agent.orders] : [];
        if (ordersToPrint.length > 0) hasAnyOrder = true;

        let agentTotalExpenses = 0;
        if(agent.expenses) {
            agent.expenses.forEach(exp => agentTotalExpenses += (parseFloat(exp.amount) || 0));
        }
        const financials = calculatePdfFinancials(ordersToPrint, agent.deliveryFee, agentTotalExpenses);

        reportHtml += `<div class="global-report-agent-section">`;
        reportHtml += `<h2>المندوب: ${sanitizeHTML(agent.name)} (${sanitizeHTML(agent.phone)} - ${sanitizeHTML(agent.area)})</h2>`;
        reportHtml += `<p class="print-agent-delivery-fee-text"><strong>أجور التوصيل للطلب الواحد:</strong> <span>${formatNumber(agent.deliveryFee || 0, true)}</span></p>`;
        reportHtml += generateGlobalReportAgentFinancialSummaryHtml(financials);
        reportHtml += generateOrdersTableHtml(ordersToPrint);
        reportHtml += `</div>`;
    });

     if (!hasAnyOrder && agents.length > 0) {
         reportHtml += `<p id="no-orders-message" style="text-align:center; color: var(--secondary-color); padding-top:20px;">لا توجد أي طلبات لأي مندوب في النظام حاليًا.</p>`;
    } else if (agents.length === 0) {
        reportHtml += `<p id="no-orders-message" style="text-align:center; color: var(--secondary-color); padding-top:20px;">لا يوجد مندوبون في النظام.</p>`;
    }


    globalPdfReportContentDiv.innerHTML = reportHtml;
    triggerPrint('تقرير شامل لجميع الطلبات', 'printing-global-report');
    closeModal(mainSettingsModal);
};

// Global PDF - Non-Delivered Orders
exportGlobalOrdersNonDeliveredPDFBtn.onclick = () => {
    if (agents.length === 0) {
        alert("لا يوجد بيانات لتصديرها كملف PDF.");
        closeModal(mainSettingsModal);
        return;
    }
    let reportHtml = generatePrintMetaHeaderHtml(pdfGenerationCounter + 1, getFormattedDateTimeForPrint());
    let hasAnyNonDeliveredOrder = false;

    agents.forEach(agent => {
        const nonDeliveredOrders = agent.orders ? agent.orders.filter(order => order.statusHistory[order.statusHistory.length - 1].status !== STATUS_DELIVERED) : [];
        if (nonDeliveredOrders.length > 0) hasAnyNonDeliveredOrder = true;

        let agentTotalExpenses = 0;
        if(agent.expenses) {
            agent.expenses.forEach(exp => agentTotalExpenses += (parseFloat(exp.amount) || 0));
        }
        const financials = calculatePdfFinancials(nonDeliveredOrders, agent.deliveryFee, agentTotalExpenses);

        reportHtml += `<div class="global-report-agent-section">`;
        reportHtml += `<h2>المندوب: ${sanitizeHTML(agent.name)} (${sanitizeHTML(agent.phone)} - ${sanitizeHTML(agent.area)})</h2>`;
        reportHtml += `<p class="print-agent-delivery-fee-text"><strong>أجور التوصيل للطلب الواحد:</strong> <span>${formatNumber(agent.deliveryFee || 0, true)}</span></p>`;
        reportHtml += generateGlobalReportAgentFinancialSummaryHtml(financials);
        reportHtml += generateOrdersTableHtml(nonDeliveredOrders);
        reportHtml += `</div>`;
    });

    if (!hasAnyNonDeliveredOrder && agents.length > 0) {
         reportHtml += `<p id="no-orders-message" style="text-align:center; color: var(--secondary-color); padding-top:20px;">لا توجد طلبات (عدا المسلم) لأي مندوب في النظام حاليًا.</p>`;
    } else if (agents.length === 0) {
         reportHtml += `<p id="no-orders-message" style="text-align:center; color: var(--secondary-color); padding-top:20px;">لا يوجد مندوبون في النظام.</p>`;
    }

    globalPdfReportContentDiv.innerHTML = reportHtml;
    triggerPrint('تقرير شامل للطلبات (عدا المسلم)', 'printing-global-report');
    closeModal(mainSettingsModal);
};


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderAgentsList();
    populateStatusSelect(orderStatusSelect);
    document.querySelector('main')!.setAttribute('tabindex', '-1');
    document.getElementById('current-agent-action-menu-container-wrapper')!.classList.add('hidden');
    setupActionMenuToggleListeners();

    // Debounce global search input
    globalSearchInput.addEventListener('input', debounce(handleGlobalSearch, 300));

    viewAgentExpensesBtn.onclick = () => {
        if (currentlyViewingAgentId !== null) {
            openAgentExpensesModal(currentlyViewingAgentId);
        }
    };

    // Save data automatically when the user leaves the page
    window.addEventListener('beforeunload', saveData);
});
