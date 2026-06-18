'use client'

import { useDashboard } from '@/context/dashboard-context'
import {
  CreditCardIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  CopyIcon,
  XIcon,
  CheckIcon,
  LockIcon
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

interface PaymentHistoryItem {
  id: string
  invoiceNo: string
  period: string
  method: string
  amount: number
  datePaid: string
  status: 'success' | 'pending'
}

export default function PaymentPage() {
  const t = useTranslations('Dashboard')
  const { userData, currentLang, isPaid, setIsPaid } = useDashboard()

  const isIndo = currentLang === 'id'
  const isUniv = userData?.tier === 'univ'

  // Dynamic configuration based on tier (UKT vs SPP)
  const feeLabel = isUniv
    ? isIndo
      ? 'UKT (Uang Kuliah Tunggal)'
      : 'UKT (Tuition Fee)'
    : isIndo
      ? 'SPP (Sumbangan Pembinaan Pendidikan)'
      : 'SPP (School Tuition)'

  const currentPeriod = isUniv
    ? isIndo
      ? 'Semester Ganjil 2026/2027'
      : 'Odd Semester 2026/2027'
    : isIndo
      ? 'Juli 2026'
      : 'July 2026'

  const baseAmount = isUniv ? 8500000 : 550000
  const serviceFee = 2500

  // Mock initial history items based on tier
  const initialHistory: PaymentHistoryItem[] = isUniv
    ? [
        {
          id: 'pay-2',
          invoiceNo: 'INV/20260210/OA/0098',
          period: isIndo ? 'Semester Genap 2025/2026' : 'Even Semester 2025/2026',
          method: 'BCA Virtual Account',
          amount: 8500000,
          datePaid: '10 Feb 2026',
          status: 'success'
        },
        {
          id: 'pay-1',
          invoiceNo: 'INV/20250815/OA/0023',
          period: isIndo ? 'Semester Ganjil 2025/2026' : 'Odd Semester 2025/2026',
          method: 'Mandiri Virtual Account',
          amount: 8500000,
          datePaid: '15 Aug 2025',
          status: 'success'
        }
      ]
    : [
        {
          id: 'pay-5',
          invoiceNo: 'INV/20260610/OA/0567',
          period: isIndo ? 'Juni 2026' : 'June 2026',
          method: 'GoPay',
          amount: 550000,
          datePaid: '10 Jun 2026',
          status: 'success'
        },
        {
          id: 'pay-4',
          invoiceNo: 'INV/20260510/OA/0412',
          period: isIndo ? 'Mei 2026' : 'May 2026',
          method: 'OVO',
          amount: 550000,
          datePaid: '10 May 2026',
          status: 'success'
        },
        {
          id: 'pay-3',
          invoiceNo: 'INV/20260408/OA/0299',
          period: isIndo ? 'April 2026' : 'April 2026',
          method: 'GoPay',
          amount: 550000,
          datePaid: '08 Apr 2026',
          status: 'success'
        }
      ]

  // Page states (All hooks are initialized at the very top)
  const [history, setHistory] = useState<PaymentHistoryItem[]>(initialHistory)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<'va' | 'ewallet' | 'cc'>('va')
  const [ccNumber, setCcNumber] = useState('')
  const [ccExpiry, setCcExpiry] = useState('')
  const [ccCvv, setCcCvv] = useState('')

  if (!userData) return null

  // Helper formatting rupiah
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  // Handle Pay Click
  const handlePayClick = () => {
    if (isPaid) return
    setIsModalOpen(true)
    setModalStep(1)
    setSelectedMethod(null)
  }

  // Handle Method Selection
  const handleSelectMethod = (method: string, channel: 'va' | 'ewallet' | 'cc') => {
    setSelectedMethod(method)
    setSelectedChannel(channel)
    setModalStep(2)
  }

  // Handle Simulate Successful Payment Callback
  const handleSimulatePaymentSuccess = () => {
    setIsPaid(true)
    const newInvoiceNo = `INV/20260618/OA/${Math.floor(1000 + Math.random() * 9000)}`
    const newHistoryItem: PaymentHistoryItem = {
      id: `pay-${Date.now()}`,
      invoiceNo: newInvoiceNo,
      period: currentPeriod,
      method: selectedMethod || 'Simulated Online Pay',
      amount: baseAmount,
      datePaid: '18 Jun 2026',
      status: 'success'
    }

    setHistory((prev) => [newHistoryItem, ...prev])
    setModalStep(3)
    toast.success(isIndo ? `Pembayaran ${feeLabel} Berhasil Diproses!` : `Payment for ${feeLabel} Successfully Processed!`)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(isIndo ? 'Berhasil disalin ke papan klip!' : 'Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-neutral-800/60">
        <h1 className="text-xl font-black tracking-tight text-slate-800 sm:text-2xl dark:text-white">{t('paymentTitle')}</h1>
        <p className="text-xs text-text-muted">
          {isIndo
            ? 'Kelola kewajiban biaya pendidikan, lihat tagihan aktif, dan lakukan pembayaran online secara aman.'
            : 'Manage educational fees, view active billing statements, and perform secure online payments.'}
        </p>
      </div>

      {/* ─── Main Columns ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Active Billing Card (Col-span 7) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                  {t('outstandingBill')}
                </span>
                <h2 className="text-base font-black text-slate-800 dark:text-white">{feeLabel}</h2>
              </div>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-black tracking-wide uppercase',
                  isPaid
                    ? 'border border-green-500/20 bg-green-500/10 text-green-500'
                    : 'border border-amber-500/20 bg-amber-500/10 text-amber-500'
                )}
              >
                {isPaid ? (isIndo ? 'Lunas' : 'Paid') : isIndo ? 'Belum Bayar' : 'Unpaid'}
              </span>
            </div>

            {/* Billing Breakdown */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-neutral-400">
                  {isIndo ? 'Periode Pendidikan:' : 'Academic Period:'}
                </span>
                <span className="text-slate-800 dark:text-white">{currentPeriod}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-neutral-400">{isIndo ? 'Batas Jatuh Tempo:' : 'Due Date:'}</span>
                <span className={cn('font-bold', isPaid ? 'text-slate-800 dark:text-white' : 'text-red-500')}>
                  10 Jul 2026
                </span>
              </div>

              <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 dark:bg-neutral-900/60">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-neutral-400">{isIndo ? 'Biaya Pokok:' : 'Base Fee:'}</span>
                  <span className="text-slate-800 dark:text-white">{formatCurrency(baseAmount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-2 text-xs font-semibold dark:border-neutral-800">
                  <span className="text-slate-500 dark:text-neutral-400">{isIndo ? 'Total Tagihan:' : 'Total Amount:'}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">
                    {isPaid ? formatCurrency(0) : formatCurrency(baseAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            {!isPaid && (
              <button
                onClick={handlePayClick}
                className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-center font-black tracking-wide text-white uppercase shadow-md transition hover:scale-[0.99] hover:bg-[#006eb5] focus:outline-none"
              >
                {isIndo ? 'Bayar Sekarang' : 'Pay Now'}
              </button>
            )}

            {isPaid && (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-xs font-bold text-green-500">
                <CheckCircleIcon size={16} />
                <span>
                  {isIndo
                    ? 'Kewajiban biaya pendidikan semester ini telah terpenuhi.'
                    : 'Education fee requirement for this semester has been fulfilled.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Payment History (Col-span 5) */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
            <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">{t('paymentHistory')}</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-neutral-800">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-neutral-800/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] leading-none font-black tracking-wide text-slate-400 uppercase">
                      {item.invoiceNo.split('/').pop()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">{item.datePaid}</span>
                  </div>
                  <p className="text-xs font-black text-slate-800 dark:text-neutral-100">{item.period}</p>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500">{item.method}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-800 dark:text-white">{formatCurrency(item.amount)}</p>
                    <span className="inline-block rounded bg-green-500/10 px-1.5 py-0.5 text-[8px] font-black tracking-wide text-green-500 uppercase">
                      Success
                    </span>
                  </div>

                  {/* Simulated Receipt Download */}
                  <button
                    onClick={() => toast.success(isIndo ? 'Mengunduh kuitansi PDF...' : 'Downloading PDF receipt...')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:bg-neutral-900/60 dark:hover:bg-neutral-800"
                    title={isIndo ? 'Unduh Kuitansi' : 'Download Receipt'}
                  >
                    <DownloadSimpleIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Online Payment Checkout Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-neutral-800/80 dark:bg-[#181818]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                {modalStep === 1
                  ? isIndo
                    ? 'Pilih Metode Pembayaran'
                    : 'Select Payment Method'
                  : modalStep === 2
                    ? isIndo
                      ? 'Instruksi Pembayaran'
                      : 'Payment Instruction'
                    : isIndo
                      ? 'Pembayaran Berhasil!'
                      : 'Payment Success!'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 text-xs">
              {/* STEP 1: Method Selection */}
              {modalStep === 1 && (
                <div className="space-y-4">
                  {/* Virtual Account Group */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold tracking-wide text-slate-400 uppercase">Virtual Account</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelectMethod('BCA Virtual Account', 'va')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">BCA VA</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Verifikasi Otomatis</span>
                      </button>
                      <button
                        onClick={() => handleSelectMethod('Mandiri Virtual Account', 'va')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">Mandiri VA</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Verifikasi Otomatis</span>
                      </button>
                      <button
                        onClick={() => handleSelectMethod('BNI Virtual Account', 'va')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">BNI VA</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Verifikasi Otomatis</span>
                      </button>
                      <button
                        onClick={() => handleSelectMethod('BRI Virtual Account', 'va')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">BRI VA</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Verifikasi Otomatis</span>
                      </button>
                    </div>
                  </div>

                  {/* E-Wallet Group */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold tracking-wide text-slate-400 uppercase">E-Wallet & QRIS</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelectMethod('GoPay', 'ewallet')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">GoPay / QRIS</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Instan & Mudah</span>
                      </button>
                      <button
                        onClick={() => handleSelectMethod('OVO', 'ewallet')}
                        className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                      >
                        <span className="text-[10px] font-black text-slate-700 dark:text-white">OVO</span>
                        <span className="mt-0.5 text-[8px] text-slate-400">Instan & Mudah</span>
                      </button>
                    </div>
                  </div>

                  {/* Credit Card Group */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold tracking-wide text-slate-400 uppercase">Credit Card</p>
                    <button
                      onClick={() => handleSelectMethod('Visa / MasterCard', 'cc')}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-primary hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/40"
                    >
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-slate-700 dark:text-white">
                          Visa / MasterCard
                        </span>
                        <span className="text-[8px] text-slate-400">Proses instan 3D Secure</span>
                      </div>
                      <CreditCardIcon size={20} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Instruction / Transaction details */}
              {modalStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 font-bold text-slate-500 dark:bg-neutral-900/60">
                    <span>{isIndo ? 'Metode Terpilih:' : 'Selected Method:'}</span>
                    <span className="text-slate-800 dark:text-white">{selectedMethod}</span>
                  </div>

                  {/* Render VA Code detail */}
                  {selectedChannel === 'va' && (
                    <div className="space-y-3.5">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Nomor Virtual Account</p>
                        <div className="mt-1 flex items-center justify-center gap-2">
                          <span className="text-lg font-black tracking-wider text-primary dark:text-secondary">
                            88012 02606 180045
                          </span>
                          <button
                            onClick={() => handleCopy('8801202606180045')}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            title={isIndo ? 'Salin VA' : 'Copy VA'}
                          >
                            <CopyIcon size={14} />
                          </button>
                        </div>
                      </div>

                      {/* VA steps instructions */}
                      <div className="space-y-2 border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
                        <p className="mb-1 font-black text-slate-700 dark:text-white">
                          {isIndo ? 'Cara Pembayaran ATM / M-Banking:' : 'How to Pay via ATM / M-Banking:'}
                        </p>
                        <ol className="list-inside list-decimal space-y-1">
                          <li>{isIndo ? 'Masuk ke aplikasi Mobile Banking Anda.' : 'Log in to your Mobile Banking app.'}</li>
                          <li>
                            {isIndo ? 'Pilih menu Transfer > Virtual Account.' : 'Select Transfer > Virtual Account menu.'}
                          </li>
                          <li>{isIndo ? 'Masukkan nomor VA di atas.' : 'Enter the VA number listed above.'}</li>
                          <li>{isIndo ? 'Periksa nominal dan klik Bayar.' : 'Verify the total amount and tap Pay.'}</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Render QRIS / QR Image simulation */}
                  {selectedChannel === 'ewallet' && (
                    <div className="flex flex-col items-center justify-center space-y-3.5 text-center">
                      <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm">
                        <QRCodeSVG
                          value={`https://one-academy.com/pay/qris/${Math.random().toString(36).substr(2, 9)}`}
                          size={150}
                          level="H"
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-700 dark:text-white">QRIS Satu-Academy</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {isIndo
                            ? 'Pindai QR Code di atas menggunakan aplikasi e-wallet pilihan Anda.'
                            : 'Scan this QR code using your favorite e-wallet app.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render Credit Card Input Fields */}
                  {selectedChannel === 'cc' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 dark:text-neutral-300">
                          {isIndo ? 'Nomor Kartu Kredit' : 'Credit Card Number'}
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          value={ccNumber}
                          onChange={(e) =>
                            setCcNumber(
                              e.target.value
                                .replace(/\s?/g, '')
                                .replace(/(\d{4})/g, '$1 ')
                                .trim()
                            )
                          }
                          placeholder="4111 2222 3333 4444"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-neutral-300">
                            {isIndo ? 'Masa Berlaku' : 'Expiry Date'}
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={ccExpiry}
                            onChange={(e) => setCcExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-neutral-300">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={ccCvv}
                            onChange={(e) => setCcCvv(e.target.value)}
                            placeholder="***"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount Summary */}
                  <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 font-semibold dark:border-neutral-800 dark:bg-neutral-900/60">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{feeLabel}:</span>
                      <span className="text-slate-800 dark:text-white">{formatCurrency(baseAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{isIndo ? 'Biaya Layanan:' : 'Service Fee:'}</span>
                      <span className="text-slate-800 dark:text-white">{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-bold text-slate-800 dark:border-neutral-800 dark:text-white">
                      <span>Total:</span>
                      <span>{formatCurrency(baseAmount + serviceFee)}</span>
                    </div>
                  </div>

                  {/* Simulated Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setModalStep(1)}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 font-black text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    >
                      {isIndo ? 'Kembali' : 'Back'}
                    </button>
                    <button
                      onClick={handleSimulatePaymentSuccess}
                      className="flex-1 rounded-xl bg-primary py-2.5 font-black text-white shadow-md transition hover:scale-[0.99] hover:bg-[#006eb5]"
                    >
                      {isIndo ? 'Bayar Simulasi' : 'Simulate Pay'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Successful Screen */}
              {modalStep === 3 && (
                <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
                    <CheckIcon size={28} weight="bold" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                      {isIndo ? 'Pembayaran Berhasil!' : 'Payment Successful!'}
                    </h4>
                    <p className="mx-auto mt-1 max-w-[240px] text-[10px] text-slate-400">
                      {isIndo
                        ? `Biaya kuliah semester ${feeLabel} Anda telah berhasil lunas dan diverifikasi.`
                        : `Your tuition fee for ${feeLabel} has been successfully settled and verified.`}
                    </p>
                  </div>

                  <div className="w-full space-y-2 rounded-xl bg-slate-50 p-4 font-semibold text-slate-500 dark:bg-neutral-900/60">
                    <div className="flex justify-between">
                      <span>{isIndo ? 'Metode:' : 'Method:'}</span>
                      <span className="text-slate-800 dark:text-white">{selectedMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isIndo ? 'Total Bayar:' : 'Total Paid:'}</span>
                      <span className="text-slate-800 dark:text-white">{formatCurrency(baseAmount + serviceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-green-500">LUNAS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400">
                    <LockIcon size={12} />
                    <span>Secure Encrypted Transaction</span>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full rounded-xl bg-slate-100 py-2.5 font-black tracking-wide text-slate-700 uppercase transition hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    {isIndo ? 'Tutup' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
