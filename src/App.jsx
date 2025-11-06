// src/App.jsx (全新的程式碼)

import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

// 匯入我們剛剛建立的兩個空白頁面
import { MainPage } from './components/MainPage'
import { CollectionPage } from './components/CollectionPage'

export default function App () {
  // *** 1. 建立「收藏」的狀態 ***
  // 這是你 Figma 設計的核心！
  // 我們會把 "collection" 這個狀態（一個存放 PMID 的陣列）
  // 和 "setCollection" 這個函式，傳遞給兩個子頁面。
  const [collection, setCollection] = useState(() => {
    // 嘗試從 localStorage 讀取儲存的收藏
    const saved = localStorage.getItem('lotus-collection');
    return saved ? JSON.parse(saved) : [];
  });

  // *** 2. 建立「新增/移除收藏」的輔助函式 ***

  // (我們把函式定義在這裡，才能傳給兩個頁面使用)
  const updateCollection = (newCollection) => {
    setCollection(newCollection);
    // 將新收藏存到瀏覽器的 localStorage，這樣重整頁面才不會不見
    localStorage.setItem('lotus-collection', JSON.stringify(newCollection));
  };

  const addToCollection = (study) => {
    // 我們收藏整筆 study 資料，而不只是 pmid
    const newCollection = [...collection, study];
    updateCollection(newCollection);
  };

  const removeFromCollection = (study_id) => {
    const newCollection = collection.filter(item => item.study_id !== study_id);
    updateCollection(newCollection);
  };

  // 檢查某篇文獻是否已在收藏中
  const isCollected = (study_id) => {
    return collection.some(item => item.study_id === study_id);
  };


  // *** 3. 這是新的 App 佈局 ***
  // 它只包含「共用的頂部」和「路由切換器」
  return (
    // 我們用 'app-container' 取代舊的 'app'，稍後會為它添加樣式
    <div className="app-container">
      
      {/* --- 這是 Figma 上的「共用頂部」 --- */}
      <header className="app-header-figma">
        <div className="logo">
          {/* 我們用 Link to="/" 讓 Logo 可以點擊回主頁 */}
          <Link to="/">LoTUS-BF</Link>
        </div>
        
        {/* "My collections" 按鈕 */}
        <Link to="/collection" className="collection-button">
          MY COLLECTIONS
        </Link>
      </header>

      {/* --- 這是「路由切換器」 --- */}
      {/* Routes 會根據你瀏覽器的網址，
        自動在 <MainPage> 和 <CollectionPage> 之間切換
      */}
      <main className="app-content">
        <Routes>
          
          {/* 路由一：主頁 (/) */}
          <Route 
            path="/" 
            element={
              <MainPage 
                // 把「收藏」的狀態和函式傳遞下去
                collection={collection}
                isCollected={isCollected}
                addToCollection={addToCollection}
                removeFromCollection={removeFromCollection}
              />
            } 
          />
          
          {/* 路由二：收藏頁 (/collection) */}
          <Route 
            path="/collection" 
            element={
              <CollectionPage 
                // 也把狀態和函式傳下去
                collection={collection}
                removeFromCollection={removeFromCollection}
              />
            } 
          />

        </Routes>
      </main>
    </div>
  )
}