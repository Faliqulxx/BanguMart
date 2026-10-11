"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialProducts, Product } from "@/data/products";
import { initialCustomers, Customer } from "@/data/customers";
import { initialSuppliers, Supplier } from "@/data/suppliers";
import { initialTransactions, Transaction, TransactionItem, PaymentMethod } from "@/data/transactions";
import { initialReceivables, ReceivableInvoice } from "@/data/receivables";
import { initialQuotations, Quotation } from "@/data/quotations";
import { initialSalesOrders, SalesOrder } from "@/data/salesOrders";
import { initialDeliveries, Delivery, DeliveryStatus } from "@/data/deliveries";
import { initialPurchaseOrders, PurchaseOrder } from "@/data/purchaseOrders";
import { initialStats, DashboardStats } from "@/data/stats";
import { initialStoreSettings, StoreSettings, UserRole, initialUsers } from "@/data/users";
import { getEffectivePrice, calculateItemTotal } from "@/lib/pricing";
import { calculateUnitPrice } from "@/lib/units";

export interface CartItem {
  product: Product;
  selectedUnit: string;
  qty: number;
  unitPrice: number;
  discount: number; // nominal rupiah
  discountPercent: number;
  note?: string;
  total: number;
}

export interface HeldCart {
  id: string;
  date: string;
  items: CartItem[];
  customer: Customer | null;
  note: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "warning" | "error" | "info";
}

interface AppStore {
  // Master data
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  receivables: ReceivableInvoice[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  deliveries: Delivery[];
  purchaseOrders: PurchaseOrder[];
  stats: DashboardStats;
  settings: StoreSettings;
  currentRole: UserRole;
  
  // POS Cart State
  cart: CartItem[];
  selectedCustomer: Customer | null;
  shippingFee: number;
  cartDiscount: number;
  cartDiscountPercent: number;
  taxEnabledInCart: boolean;
  heldCarts: HeldCart[];
  
  // UI State
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Cart Actions
  addToCart: (product: Product, unit?: string, qty?: number) => void;
  updateCartItemQty: (productId: string, qty: number) => void;
  updateCartItemUnit: (productId: string, newUnit: string) => void;
  updateCartItemPrice: (productId: string, newPrice: number) => void;
  updateCartItemDiscount: (productId: string, discount: number, isPercent?: boolean) => void;
  updateCartItemNote: (productId: string, note: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setShippingFee: (fee: number) => void;
  setCartDiscount: (discount: number, isPercent?: boolean) => void;
  setTaxEnabledInCart: (enabled: boolean) => void;
  holdCurrentCart: (note?: string) => void;
  restoreHeldCart: (heldId: string) => void;
  deleteHeldCart: (heldId: string) => void;

  // Checkout Action
  checkoutTransaction: (params: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    dueDate?: string;
    needsDelivery: boolean;
    deliveryDetails?: {
      address: string;
      driverName: "Pak Joko" | "Pak Anto";
      vehicle: "Pickup L300 (W 8920 UZ)" | "Truk Engkel (W 9102 PQ)";
      time: string;
      notes?: string;
    };
  }) => Transaction;

  // Receiving / Purchasing
  receivePurchaseOrder: (poId: string, receivedMap: Record<string, number>) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "poNo">) => void;

  // Receivables Payment
  payReceivable: (invoiceId: string, amount: number, method: string) => void;

  // Deliveries
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, receiverName?: string) => void;

  // Quotations & Orders
  convertQuotationToOrder: (quotationId: string) => void;
  convertQuotationToCart: (quotationId: string) => void;
  convertOrderToTransaction: (orderId: string) => void;
  addQuotation: (quotation: Omit<Quotation, "id" | "quotationNo">) => void;

  // Products
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  applyStockAdjustment: (productId: string, newStock: number, reason: string) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  paySupplierDebt: (supplierId: string, amount: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      customers: initialCustomers,
      suppliers: initialSuppliers,
      transactions: initialTransactions,
      receivables: initialReceivables,
      quotations: initialQuotations,
      salesOrders: initialSalesOrders,
      deliveries: initialDeliveries,
      purchaseOrders: initialPurchaseOrders,
      stats: initialStats,
      settings: initialStoreSettings,
      currentRole: "Owner",

      cart: [],
      selectedCustomer: null,
      shippingFee: 0,
      cartDiscount: 0,
      cartDiscountPercent: 0,
      taxEnabledInCart: false,
      heldCarts: [],
      toasts: [],

      showToast: (title, description, type = "success") => {
        const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
        set((state) => ({
          toasts: [...state.toasts, { id, title, description, type }],
        }));
        setTimeout(() => {
          get().dismissToast(id);
        }, 3500);
      },

      dismissToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      setCurrentRole: (role) => {
        set({ currentRole: role });
        get().showToast("Peran Berubah", `Sekarang Anda bertindak sebagai ${role}`, "info");
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        get().showToast("Pengaturan Disimpan", "Pengaturan toko berhasil diperbarui", "success");
      },

      addToCart: (product, unit, qty = 1) => {
        const { cart, selectedCustomer } = get();
        const customerTier = selectedCustomer?.priceTier || "eceran";
        const selectedUnit = unit || product.baseUnit;
        
        // Cek harga dasar untuk tier
        const baseEffective = getEffectivePrice(product.prices, customerTier, qty).unitPrice;
        const unitPrice = calculateUnitPrice(baseEffective, selectedUnit, product.baseUnit, product.units);

        const existingIndex = cart.findIndex(
          (item) => item.product.id === product.id && item.selectedUnit === selectedUnit
        );

        if (existingIndex >= 0) {
          const updated = [...cart];
          const newQty = updated[existingIndex].qty + qty;
          const newBase = getEffectivePrice(product.prices, customerTier, newQty).unitPrice;
          const newPrice = calculateUnitPrice(newBase, selectedUnit, product.baseUnit, product.units);
          
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: newQty,
            unitPrice: newPrice,
            total: calculateItemTotal(newPrice, newQty, updated[existingIndex].discount, updated[existingIndex].discountPercent),
          };
          set({ cart: updated });
        } else {
          const total = calculateItemTotal(unitPrice, qty, 0, 0);
          set({
            cart: [
              ...cart,
              {
                product,
                selectedUnit,
                qty,
                unitPrice,
                discount: 0,
                discountPercent: 0,
                total,
              },
            ],
          });
        }
        get().showToast("Ditambahkan ke Keranjang", `${product.name} (${qty} ${selectedUnit})`);
      },

      updateCartItemQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeFromCart(productId);
          return;
        }
        const { cart, selectedCustomer } = get();
        const customerTier = selectedCustomer?.priceTier || "eceran";

        const updated = cart.map((item) => {
          if (item.product.id === productId) {
            const baseEffective = getEffectivePrice(item.product.prices, customerTier, qty).unitPrice;
            const unitPrice = calculateUnitPrice(baseEffective, item.selectedUnit, item.product.baseUnit, item.product.units);
            const total = calculateItemTotal(unitPrice, qty, item.discount, item.discountPercent);
            return { ...item, qty, unitPrice, total };
          }
          return item;
        });
        set({ cart: updated });
      },

      updateCartItemUnit: (productId, newUnit) => {
        const { cart, selectedCustomer } = get();
        const customerTier = selectedCustomer?.priceTier || "eceran";

        const updated = cart.map((item) => {
          if (item.product.id === productId) {
            const baseEffective = getEffectivePrice(item.product.prices, customerTier, item.qty).unitPrice;
            const newPrice = calculateUnitPrice(baseEffective, newUnit, item.product.baseUnit, item.product.units);
            const total = calculateItemTotal(newPrice, item.qty, item.discount, item.discountPercent);
            return { ...item, selectedUnit: newUnit, unitPrice: newPrice, total };
          }
          return item;
        });
        set({ cart: updated });
      },

      updateCartItemPrice: (productId, newPrice) => {
        const { cart } = get();
        const updated = cart.map((item) => {
          if (item.product.id === productId) {
            const total = calculateItemTotal(newPrice, item.qty, item.discount, item.discountPercent);
            return { ...item, unitPrice: newPrice, total };
          }
          return item;
        });
        set({ cart: updated });
      },

      updateCartItemDiscount: (productId, discount, isPercent = false) => {
        const { cart } = get();
        const updated = cart.map((item) => {
          if (item.product.id === productId) {
            const discNominal = isPercent ? 0 : discount;
            const discPct = isPercent ? discount : 0;
            const total = calculateItemTotal(item.unitPrice, item.qty, discNominal, discPct);
            return { ...item, discount: discNominal, discountPercent: discPct, total };
          }
          return item;
        });
        set({ cart: updated });
      },

      updateCartItemNote: (productId, note) => {
        const { cart } = get();
        const updated = cart.map((item) => {
          if (item.product.id === productId) {
            return { ...item, note };
          }
          return item;
        });
        set({ cart: updated });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ cart: [], shippingFee: 0, cartDiscount: 0, cartDiscountPercent: 0, selectedCustomer: null });
      },

      setSelectedCustomer: (customer) => {
        set({ selectedCustomer: customer });
        // Recalculate cart item prices according to customer tier
        const { cart } = get();
        if (cart.length === 0) return;

        const customerTier = customer?.priceTier || "eceran";
        const updated = cart.map((item) => {
          const baseEffective = getEffectivePrice(item.product.prices, customerTier, item.qty).unitPrice;
          const unitPrice = calculateUnitPrice(baseEffective, item.selectedUnit, item.product.baseUnit, item.product.units);
          const total = calculateItemTotal(unitPrice, item.qty, item.discount, item.discountPercent);
          return { ...item, unitPrice, total };
        });
        set({ cart: updated });
      },

      setShippingFee: (fee) => set({ shippingFee: fee }),
      setCartDiscount: (discount, isPercent = false) => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
        if (isPercent) {
          const pct = Math.max(0, Math.min(100, discount));
          const nominal = Math.round((subtotal * pct) / 100);
          set({ cartDiscount: nominal, cartDiscountPercent: pct });
        } else {
          const nominal = Math.max(0, discount);
          const pct = subtotal > 0 ? Number(((nominal / subtotal) * 100).toFixed(1)) : 0;
          set({ cartDiscount: nominal, cartDiscountPercent: pct });
        }
      },
      setTaxEnabledInCart: (enabled) => set({ taxEnabledInCart: enabled }),

      holdCurrentCart: (note = "Transaksi ditahan") => {
        const { cart, selectedCustomer, heldCarts } = get();
        if (cart.length === 0) return;

        const held: HeldCart = {
          id: "hold-" + Date.now(),
          date: new Date().toISOString(),
          items: [...cart],
          customer: selectedCustomer,
          note,
        };

        set({
          heldCarts: [...heldCarts, held],
          cart: [],
          selectedCustomer: null,
          shippingFee: 0,
          cartDiscount: 0,
        });
        get().showToast("Transaksi Ditahan", "Keranjang berhasil disimpan di antrean hold", "info");
      },

      restoreHeldCart: (heldId) => {
        const { heldCarts } = get();
        const found = heldCarts.find((h) => h.id === heldId);
        if (!found) return;

        set({
          cart: found.items,
          selectedCustomer: found.customer,
          heldCarts: heldCarts.filter((h) => h.id !== heldId),
        });
        get().showToast("Antrean Dipulihkan", "Keranjang transaksi kembali dibuka", "success");
      },

      deleteHeldCart: (heldId) => {
        set((state) => ({
          heldCarts: state.heldCarts.filter((h) => h.id !== heldId),
        }));
        get().showToast("Dihapus", "Antrean hold dibatalkan", "info");
      },

      checkoutTransaction: ({ paymentMethod, amountPaid, change, dueDate, needsDelivery, deliveryDetails }) => {
        const { cart, selectedCustomer, shippingFee, cartDiscount, taxEnabledInCart, settings, products, transactions, receivables, deliveries, stats, customers } = get();

        const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
        const tax = taxEnabledInCart ? Math.round((subtotal - cartDiscount) * (settings.taxRatePercent / 100)) : 0;
        const total = Math.max(0, subtotal - cartDiscount + tax + shippingFee);

        const now = new Date();
        const trxIndex = transactions.length + 19;
        const trxNo = `TRX-${String(trxIndex).padStart(4, "0")}`;
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
        const invoiceNo = `INV-${dateStr}-${String(trxIndex).padStart(4, "0")}`;

        const trxItems: TransactionItem[] = cart.map((item) => ({
          productId: item.product.id,
          code: item.product.code,
          name: item.product.name,
          unit: item.selectedUnit,
          unitPrice: item.unitPrice,
          qty: item.qty,
          subtotal: item.total,
          discount:
            item.discountPercent > 0
              ? Math.round((item.unitPrice * item.qty * item.discountPercent) / 100) + (item.discount || 0)
              : item.discount || 0,
          note: item.note,
        }));

        let deliveryId: string | undefined;
        if (needsDelivery && deliveryDetails) {
          const delIndex = deliveries.length + 1;
          const deliveryNo = `SJ-${dateStr}-${String(delIndex).padStart(3, "0")}`;
          deliveryId = `del-${Date.now()}`;

          const newDelivery: Delivery = {
            id: deliveryId,
            deliveryNo,
            trxNo,
            customerName: selectedCustomer?.name || "Pelanggan Umum",
            customerPhone: selectedCustomer?.phone || "-",
            projectAddress: deliveryDetails.address,
            date: now.toISOString().slice(0, 10),
            scheduledTime: deliveryDetails.time || "Hari ini",
            driverName: deliveryDetails.driverName,
            vehicle: deliveryDetails.vehicle,
            items: cart.map((c) => ({ name: c.product.name, qty: c.qty, unit: c.selectedUnit })),
            shippingFee,
            status: "Disiapkan",
            notes: deliveryDetails.notes,
          };
          set({ deliveries: [newDelivery, ...deliveries] });
        }

        const isCredit = paymentMethod === "Kredit" || paymentMethod === "DP_Tempo";
        const status = isCredit ? "Belum Lunas" : "Selesai";

        const newTrx: Transaction = {
          id: "trx-" + Date.now(),
          trxNo,
          invoiceNo,
          date: now.toISOString(),
          customerId: selectedCustomer?.id || "cust-general",
          customerName: selectedCustomer?.name || "Pelanggan Umum",
          customerType: selectedCustomer?.type || "Umum",
          cashierName: get().currentRole === "Owner" ? "Budi Santoso" : "Rina Wulandari",
          items: trxItems,
          subtotal,
          discount: cartDiscount,
          tax,
          shippingFee,
          total,
          paymentMethod,
          amountPaid,
          change,
          status,
          dueDate: isCredit ? dueDate || "2026-11-18" : undefined,
          needsDelivery,
          deliveryId,
          projectAddress: deliveryDetails?.address,
        };

        // Potong stok produk
        const updatedProducts = products.map((prod) => {
          const cartItem = cart.find((c) => c.product.id === prod.id);
          if (!cartItem) return prod;
          const unitMatch = prod.units.find((u) => u.unit.toLowerCase() === cartItem.selectedUnit.toLowerCase());
          const factor = unitMatch ? unitMatch.factor : 1;
          const qtyInBase = cartItem.qty * factor;
          const newStock = Math.max(0, prod.stock - qtyInBase);
          return { ...prod, stock: newStock };
        });

        // Catat piutang jika kredit
        if (isCredit && selectedCustomer) {
          const remainingAmount = Math.max(0, total - amountPaid);
          const newReceivable: ReceivableInvoice = {
            id: "rec-" + Date.now(),
            invoiceNo,
            trxNo,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            customerType: selectedCustomer.type,
            customerPhone: selectedCustomer.phone,
            invoiceDate: now.toISOString().slice(0, 10),
            dueDate: dueDate || "2026-11-18",
            totalAmount: total,
            paidAmount: amountPaid,
            remainingAmount,
            status: "Belum Jatuh Tempo",
            agingDays: 0,
            notes: deliveryDetails?.address,
          };

          const updatedCustomers = customers.map((c) =>
            c.id === selectedCustomer.id
              ? { ...c, currentReceivable: c.currentReceivable + remainingAmount }
              : c
          );
          set({
            receivables: [newReceivable, ...receivables],
            customers: updatedCustomers,
          });
        }

        // Update stats
        const totalItemsQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const updatedStats: DashboardStats = {
          ...stats,
          penjualanHariIni: stats.penjualanHariIni + total,
          jumlahTransaksi: stats.jumlahTransaksi + 1,
          produkTerjual: stats.produkTerjual + totalItemsQty,
        };

        set({
          transactions: [newTrx, ...transactions],
          products: updatedProducts,
          stats: updatedStats,
          cart: [],
          selectedCustomer: null,
          shippingFee: 0,
          cartDiscount: 0,
          cartDiscountPercent: 0,
        });

        get().showToast("Transaksi Berhasil!", `${trxNo} - Total Rp ${total.toLocaleString("id-ID")}`, "success");
        return newTrx;
      },

      receivePurchaseOrder: (poId, receivedMap) => {
        const { purchaseOrders, products, suppliers } = get();
        const po = purchaseOrders.find((p) => p.id === poId);
        if (!po) return;

        let allReceived = true;
        const updatedItems = po.items.map((item) => {
          const newlyReceived = receivedMap[item.productId] || 0;
          const totalReceived = (item.receivedQty || 0) + newlyReceived;
          if (totalReceived < item.qty) allReceived = false;
          return { ...item, receivedQty: totalReceived };
        });

        // Tambah stok produk di inventory
        const updatedProducts = products.map((prod) => {
          const received = receivedMap[prod.id] || 0;
          if (received > 0) {
            return { ...prod, stock: prod.stock + received };
          }
          return prod;
        });

        const newStatus = allReceived ? "Diterima" : "Diterima Sebagian";
        const updatedPOs = purchaseOrders.map((p) =>
          p.id === poId
            ? {
                ...p,
                items: updatedItems,
                status: newStatus as PurchaseOrder["status"],
                receivedDate: new Date().toISOString().slice(0, 10),
              }
            : p
        );

        // Update hutang supplier jika belum lunas
        const updatedSuppliers = suppliers.map((s) => {
          if (s.id === po.supplierId && !po.isPaid) {
            return { ...s, totalDebt: s.totalDebt + po.total };
          }
          return s;
        });

        set({
          purchaseOrders: updatedPOs,
          products: updatedProducts,
          suppliers: updatedSuppliers,
        });

        get().showToast("Barang Diterima", `Stok produk bertambah dari ${po.poNo}`, "success");
      },

      addPurchaseOrder: (poData) => {
        const { purchaseOrders } = get();
        const poNo = `PO-202610-${String(purchaseOrders.length + 1).padStart(3, "0")}`;
        const newPO: PurchaseOrder = {
          ...poData,
          id: "po-" + Date.now(),
          poNo,
        };
        set({ purchaseOrders: [newPO, ...purchaseOrders] });
        get().showToast("PO Dibuat", `Nomor: ${poNo}`, "success");
      },

      payReceivable: (invoiceId, amount, method) => {
        const { receivables, customers, stats } = get();
        const inv = receivables.find((r) => r.id === invoiceId);
        if (!inv) return;

        const newPaid = inv.paidAmount + amount;
        const newRemaining = Math.max(0, inv.remainingAmount - amount);

        const updatedReceivables = receivables.map((r) => {
          if (r.id === invoiceId) {
            return {
              ...r,
              paidAmount: newPaid,
              remainingAmount: newRemaining,
            };
          }
          return r;
        });

        const updatedCustomers = customers.map((c) => {
          if (c.id === inv.customerId) {
            return { ...c, currentReceivable: Math.max(0, c.currentReceivable - amount) };
          }
          return c;
        });

        const updatedStats: DashboardStats = {
          ...stats,
          piutang: {
            ...stats.piutang,
            total: Math.max(0, stats.piutang.total - amount),
          },
        };

        set({
          receivables: updatedReceivables,
          customers: updatedCustomers,
          stats: updatedStats,
        });

        get().showToast(
          "Pembayaran Diterima",
          `Pelunasan Rp ${amount.toLocaleString("id-ID")} via ${method} untuk ${inv.invoiceNo}`,
          "success"
        );
      },

      updateDeliveryStatus: (deliveryId, status, receiverName) => {
        const { deliveries } = get();
        const updated = deliveries.map((d) => {
          if (d.id === deliveryId) {
            return {
              ...d,
              status,
              receivedBy: receiverName || d.receivedBy,
              receivedAt: status === "Diterima" ? new Date().toISOString() : d.receivedAt,
              signaturePlaceholder: status === "Diterima" ? true : d.signaturePlaceholder,
            };
          }
          return d;
        });
        set({ deliveries: updated });
        get().showToast("Status Pengiriman", `Pengiriman diperbarui ke status: ${status}`, "info");
      },

      convertQuotationToOrder: (quotationId) => {
        const { quotations, salesOrders } = get();
        const qt = quotations.find((q) => q.id === quotationId);
        if (!qt) return;

        const orderNo = `SO-202610-${String(salesOrders.length + 1).padStart(3, "0")}`;
        const newSO: SalesOrder = {
          id: "so-" + Date.now(),
          orderNo,
          date: new Date().toISOString(),
          customerId: qt.customerId,
          customerName: qt.customerName,
          projectName: qt.projectName,
          items: qt.items.map((i) => ({ ...i })),
          subtotal: qt.subtotal,
          discount: qt.discount,
          shippingFee: qt.shippingFee,
          total: qt.total,
          dpPaid: 0,
          remainingAmount: qt.total,
          status: "Baru",
          notes: `Dibuat dari Penawaran ${qt.quotationNo}`,
        };

        const updatedQuotations = quotations.map((q) =>
          q.id === quotationId ? { ...q, status: "Disetujui" as const } : q
        );

        set({
          salesOrders: [newSO, ...salesOrders],
          quotations: updatedQuotations,
        });
        get().showToast("Berhasil Dikonversi", `Pesanan ${orderNo} berhasil dibuat`, "success");
      },

      convertQuotationToCart: (quotationId) => {
        const { quotations, products, customers } = get();
        const qt = quotations.find((q) => q.id === quotationId);
        if (!qt) return;

        const customer = customers.find((c) => c.id === qt.customerId) || null;
        const newCartItems: CartItem[] = [];

        qt.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            newCartItems.push({
              product,
              selectedUnit: item.unit,
              qty: item.qty,
              unitPrice: item.unitPrice,
              discount: 0,
              discountPercent: 0,
              total: item.subtotal,
            });
          }
        });

        set({
          cart: newCartItems,
          selectedCustomer: customer,
          shippingFee: qt.shippingFee,
          cartDiscount: qt.discount,
        });
        get().showToast("Keranjang Diisi", `Item dari ${qt.quotationNo} dimasukkan ke kasir`, "success");
      },

      convertOrderToTransaction: (orderId) => {
        const { salesOrders } = get();
        const so = salesOrders.find((s) => s.id === orderId);
        if (!so) return;

        get().convertQuotationToCart(orderId);
        set((state) => ({
          salesOrders: state.salesOrders.map((s) =>
            s.id === orderId ? { ...s, status: "Siap" as const } : s
          ),
        }));
        get().showToast("Siap Diproses", `Pesanan ${so.orderNo} siap ditransaksikan`, "info");
      },

      addQuotation: (data) => {
        const { quotations } = get();
        const quotationNo = `QT-202610-${String(quotations.length + 1).padStart(3, "0")}`;
        const newQt: Quotation = {
          ...data,
          id: "qt-" + Date.now(),
          quotationNo,
        };
        set({ quotations: [newQt, ...quotations] });
        get().showToast("Penawaran Dibuat", `Nomor ${quotationNo}`, "success");
      },

      addProduct: (prod) => {
        const { products } = get();
        const newP: Product = {
          ...prod,
          id: "prod-" + Date.now(),
        };
        set({ products: [newP, ...products] });
        get().showToast("Produk Ditambahkan", `${newP.name} berhasil disimpan`, "success");
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        get().showToast("Produk Diperbarui", "Data produk berhasil disimpan", "success");
      },

      applyStockAdjustment: (productId, newStock, reason) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
        }));
        get().showToast("Stok Opname Diterapkan", `Stok disesuaikan ke ${newStock}. Alasan: ${reason}`, "success");
      },

      addCustomer: (cust) => {
        const { customers } = get();
        const newC: Customer = {
          ...cust,
          id: "cust-" + Date.now(),
        };
        set({ customers: [newC, ...customers] });
        get().showToast("Pelanggan Ditambahkan", `${newC.name} berhasil didaftarkan`, "success");
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        get().showToast("Pelanggan Diperbarui", "Data pelanggan berhasil disimpan", "success");
      },

      addSupplier: (sup) => {
        const { suppliers } = get();
        const newS: Supplier = {
          ...sup,
          id: "sup-" + Date.now(),
        };
        set({ suppliers: [newS, ...suppliers] });
        get().showToast("Supplier Ditambahkan", `${newS.name} berhasil disimpan`, "success");
      },

      paySupplierDebt: (supplierId, amount) => {
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s.id === supplierId ? { ...s, totalDebt: Math.max(0, s.totalDebt - amount) } : s
          ),
        }));
        get().showToast("Hutang Dibayar", `Pembayaran hutang supplier Rp ${amount.toLocaleString("id-ID")} tercatat`, "success");
      },
    }),
    {
      name: "bangumart-pos-storage",
      partialize: (state) => ({
        products: state.products,
        customers: state.customers,
        suppliers: state.suppliers,
        transactions: state.transactions,
        receivables: state.receivables,
        quotations: state.quotations,
        salesOrders: state.salesOrders,
        deliveries: state.deliveries,
        purchaseOrders: state.purchaseOrders,
        stats: state.stats,
        settings: state.settings,
        currentRole: state.currentRole,
        heldCarts: state.heldCarts,
      }),
    }
  )
);
