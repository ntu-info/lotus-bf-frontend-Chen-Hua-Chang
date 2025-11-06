// src/components/CollectionPage.jsx

import React from 'react'
import { Link } from 'react-router-dom' // 匯入 "Link" 讓我們可以連回主頁
import { classNames } from './Studies' // 假設 Studies.js 匯出了 classNames

// 1. 接收從 App.jsx 傳來的「收藏」狀態
export function CollectionPage ({ collection, removeFromCollection }) {
  return (
    // 2. 建立一個容器
    // (我們暫時借用舊的 'app' classname 來排版)
    <div className="app" style={{ height: 'calc(100vh - 80px)' }}>

      {/* --- 頁面標題和返回按鈕 --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="text-3xl font-bold text-gray-800">
          My Collections ({collection.length})
        </h1>
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; 返回主搜尋頁
        </Link>
      </div>

      {/* --- 檢查收藏是否為空 --- */}
      {collection.length === 0 ? (
        <div className="p-4 bg-white rounded-lg border text-gray-500">
          你的收藏目前是空的。
        </div>
      ) : (
        
        // 3. 渲染收藏表格 (Figma 第二張圖)
        <div className='overflow-auto rounded-2xl border'>
          <table className='min-w-full text-sm'>
            <thead className='sticky top-0 bg-gray-50 text-left'>
              <tr>
                <th className='px-3 py-2 font-semibold'>Year</th>
                <th className='px-3 py-2 font-semibold'>Journal</th>
                <th className='px-3 py-2 font-semibold'>Title</th>
                <th className='px-3 py-2 font-semibold'>Authors</th>
                <th className='px-3 py-2 font-semibold'>PMID</th>
                <th className='px-3 py-2 font-semibold'>Remove</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((r, i) => (
                <tr key={r.study_id} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                  <td className='whitespace-nowrap px-3 py-2 align-top'>{r.year ?? ''}</td>
                  <td className='px-3 py-2 align-top'>{r.journal || ''}</td>
                  <td className='max-w-[540px] px-3 py-2 align-top'><div className='truncate' title={r.title}>{r.title || ''}</div></td>
                  <td className='px-3 py-2 align-top'>{r.authors || ''}</td>
                  
                  {/* PubMed 連結 */}
                  <td className='whitespace-nowrap px-3 py-2 align-top'>
                    <a 
                      href={`https://pubmed.ncbi.nlm.nih.gov/${r.study_id}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='text-blue-600 hover:underline'
                    >
                      {r.study_id}
                    </a>
                  </td>

                  {/* 移除按鈕 (Figma 上的 "-" 按鈕) */}
                  <td className='whitespace-nowrap px-3 py-2 align-top text-center'>
                    <button
                      title="Remove from collection"
                      onClick={() => removeFromCollection(r.study_id)}
                      className="px-2 py-1 bg-red-600 text-white rounded-full text-lg font-bold"
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        lineHeight: '1' // 確保 "-" 置中
                      }}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}