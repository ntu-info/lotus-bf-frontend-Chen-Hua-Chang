// src/components/RelatedTerms.jsx
// *** 這是步驟 15 的版本 ***
// (修正了 renderResults 邏輯，並新增 onPickTerm 功能)

import React, { useState, useEffect } from 'react'
import { API_BASE } from '../api'

// *** 修正點 1：使用你舊專案的「正確」渲染邏輯 ***
function renderResults(data, onPickTerm) { // *** 修正點 3：接收 onPickTerm ***
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return <p className="text-sm text-gray-500">No related terms found.</p>;
  }

  return (
    <ul className="space-y-2 list-none p-0">
      {keys.map(key => {
        const related = data[key];
        if (!Array.isArray(related)) return null; 

        return (
          <li key={key} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-800">
            <strong className="text-sm font-medium text-indigo-700">{key}:</strong>
            <div className="mt-1 flex flex-wrap">
              {related.map((item, index) => { // 新增 index 作為 key
                
                // --- 這是你舊專案的「正確」邏輯 ---
                let term = '';
                let score = '';
                
                if (typeof item === 'object' && item !== null && item.term !== undefined) {
                    // 情況 A: 項目是 { term: "...", score: ... }
                    term = item.term;
                    if (item.score !== undefined) {
                        score = ` (${item.score.toFixed(2)})`;
                    }
                } else if (typeof item === 'string') {
                    // 情況 B: 項目是簡單字串 (向下相容)
                    term = item;
                } else {
                    // 情況 C: 未知格式 (忽略)
                    return null; 
                }
                // --- 邏輯結束 ---
                
                return (
                  <span 
                    key={`${term}-${index}`} // 使用更穩固的 key
                    className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-full cursor-pointer hover:bg-indigo-200"
                    style={{ backgroundColor: '#e0f2fe', color: '#1e40af' }}
                    // *** 修正點 3：新增 onClick ***
                    onClick={() => onPickTerm(term)}
                    title={`Click to add "${term}" to Query Builder`}
                  >
                    {term}{score}
                  </span>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// *** 修正點 3：接收 onPickTerm 並傳下去 ***
export function RelatedTerms({ query, onPickTerm }) {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setResults(null);
      const endpoint = `/terms/${encodeURIComponent(query)}`;
      const url = `${API_BASE}${endpoint}`;
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    const timerId = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="related-terms-container overflow-auto no-scrollbar" style={{ maxHeight: 'calc(100% - 40px)' }}> 
      {isLoading && (
        <div className="text-sm text-gray-500">Loading terms...</div> 
      )}
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          ❌ Error: {error}
        </div>
      )}
      {results && !isLoading && (
        <div className="mt-2 space-y-4">
          {/* *** 修正點 3：把 onPickTerm 傳給 renderResults *** */}
          {renderResults(results, onPickTerm)}
        </div>
      )}
      {!results && !isLoading && !error && (
         <div className="text-sm text-gray-400">
           {query ? `No related terms found for "${query}".` : 'Related terms will appear here.'}
         </div>
      )}
    </div>
  );
}