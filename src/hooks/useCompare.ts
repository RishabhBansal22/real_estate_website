"use client";

import { useState, useEffect } from "react";

const COMPARE_KEY = "aura_compare_list";
const MAX_COMPARE = 4;

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(COMPARE_KEY);
    if (saved) {
      try {
        setCompareIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse compare list", e);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        alert(`You can only compare up to ${MAX_COMPARE} properties at a time.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const isInCompare = (id: string) => compareIds.includes(id);

  const clearCompare = () => setCompareIds([]);

  return {
    compareIds,
    toggleCompare,
    isInCompare,
    clearCompare,
    isLimitReached: compareIds.length >= MAX_COMPARE
  };
}
