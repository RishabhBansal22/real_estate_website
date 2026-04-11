"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, IndianRupee, Percent, Calendar, TrendingUp, Home } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

export default function EMICalculator() {
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<number>(5000000); // 50 lakhs default
  const [downPayment, setDownPayment] = useState<number>(1000000); // 10 lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% default
  const [loanTerm, setLoanTerm] = useState<number>(20); // 20 years default
  const [emi, setEmi] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Initialize values from URL params
  useEffect(() => {
    const urlPrice = searchParams.get('price');
    const urlDownPayment = searchParams.get('downPayment');

    if (urlPrice) {
      setPrice(Number(urlPrice));
    }
    if (urlDownPayment) {
      setDownPayment(Number(urlDownPayment));
    }
  }, [searchParams]);

  // EMI Calculation Function
  const calculateEMI = () => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
      return;
    }

    // EMI Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
    const emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalAmountPayable = emiAmount * numberOfPayments;
    const totalInterestPayable = totalAmountPayable - principal;

    setEmi(Math.round(emiAmount));
    setTotalAmount(Math.round(totalAmountPayable));
    setTotalInterest(Math.round(totalInterestPayable));
  };

  useEffect(() => {
    calculateEMI();
  }, [price, downPayment, interestRate, loanTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-3 bg-primary-blue/10 text-primary-blue px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm mb-6">
              <Calculator size={20} />
              EMI Calculator
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-primary-blue mb-4 tracking-tighter">
              Plan Your Dream Home
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Calculate your monthly EMI payments for property purchases in India. Get accurate estimates for your home loan.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <FadeIn>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary-blue/5 border border-slate-100">
                <h2 className="text-2xl font-black text-primary-blue mb-8 flex items-center gap-3">
                  <Home size={24} />
                  Loan Details
                </h2>

                <div className="space-y-8">
                  {/* Property Price */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                      Property Price (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-primary-blue focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
                        placeholder="Enter property price"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      Current: {formatCurrency(price)}
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                      Down Payment (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-primary-blue focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
                        placeholder="Enter down payment"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      Current: {formatCurrency(downPayment)} ({((downPayment / price) * 100).toFixed(1)}% of property price)
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                      Interest Rate (%)
                    </label>
                    <div className="relative">
                      <Percent size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-primary-blue focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
                        placeholder="Enter interest rate"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      Current: {interestRate}% per annum
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                      Loan Term (Years)
                    </label>
                    <div className="relative">
                      <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-primary-blue focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
                        placeholder="Enter loan term"
                        min="1"
                        max="30"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      Current: {loanTerm} years ({loanTerm * 12} months)
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Results Section */}
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                {/* Monthly EMI */}
                <div className="bg-gradient-to-br from-primary-blue to-primary-blue-hover text-white rounded-[2.5rem] p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black uppercase tracking-widest">Monthly EMI</h3>
                    <TrendingUp size={24} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black mb-2">
                    {formatCurrency(emi)}
                  </div>
                  <p className="text-blue-100 text-sm font-medium">
                    Principal: {formatCurrency(price - downPayment)}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="text-lg font-black text-primary-blue uppercase tracking-widest mb-4">
                    Total Amount Payable
                  </h3>
                  <div className="text-3xl font-black text-slate-800 mb-2">
                    {formatCurrency(totalAmount)}
                  </div>
                  <p className="text-slate-500 text-sm">
                    Over {loanTerm} years ({loanTerm * 12} months)
                  </p>
                </div>

                {/* Total Interest */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="text-lg font-black text-primary-blue uppercase tracking-widest mb-4">
                    Total Interest
                  </h3>
                  <div className="text-3xl font-black text-slate-800 mb-2">
                    {formatCurrency(totalInterest)}
                  </div>
                  <p className="text-slate-500 text-sm">
                    Interest portion of the loan
                  </p>
                </div>

                {/* Loan Summary */}
                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-600 mb-4">
                    Loan Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Loan Amount:</span>
                      <span className="font-bold text-primary-blue">{formatCurrency(price - downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Interest Rate:</span>
                      <span className="font-bold text-primary-blue">{interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Loan Term:</span>
                      <span className="font-bold text-primary-blue">{loanTerm} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Payments:</span>
                      <span className="font-bold text-primary-blue">{loanTerm * 12} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Additional Info */}
          <FadeIn delay={0.4}>
            <div className="mt-12 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-primary-blue mb-6 uppercase tracking-widest">
                Important Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                <div>
                  <h4 className="font-bold text-primary-blue mb-2">EMI Calculation</h4>
                  <p>Calculations are based on standard EMI formula used by Indian banks. Actual EMIs may vary based on bank policies and additional charges.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary-blue mb-2">Processing Fees</h4>
                  <p>Banks typically charge 0.5-1% of loan amount as processing fees. This calculator does not include processing fees or other charges.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary-blue mb-2">Prepayment</h4>
                  <p>Most home loans allow prepayment with charges. Check with your bank for prepayment terms and charges.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary-blue mb-2">Tax Benefits</h4>
                  <p>Home loan interest and principal repayments qualify for tax deductions under Section 24(b) and 80C of Income Tax Act.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
