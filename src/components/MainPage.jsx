// src/components/MainPage.jsx
// *** 這是步驟 15 的版本 ***
// (移除了所有 resizer 邏輯，並傳遞 onPickTerm 給 RelatedTerms)

import { useCallback } from 'react' // *** 移除了 useRef 和 useState ***
import { Terms } from './Terms'
import { QueryBuilder } from './QueryBuilder'
import { Studies } from './Studies'
import { NiiViewer } from './NiiViewer'
import { RelatedTerms } from './RelatedTerms'
import { useUrlQueryState } from '../hooks/useUrlQueryState'

export function MainPage ({ collection, isCollected, addToCollection, removeFromCollection }) {
  const [query, setQuery] = useUrlQueryState('q')

  const handlePickTerm = useCallback((t) => {
    // 這個函式現在 A 區和 B 區共用
    setQuery((q) => (q ? `${q} ${t}` : t))
  }, [setQuery])

  // *** 所有的 gridRef, sizes, MIN_PX, startDrag 程式碼 ***
  // *** 已經全部被刪除 ***

  return (
    <div className="app" style={{ height: 'calc(100vh - 80px)' }}>
      {/* *** 所有的 ref={gridRef} 和 style={{...}} 都被移除了 *** */}
      <main className="app__grid" style={{ height: '100%' }}>
        
        {/* --- 1. 左邊欄容器 --- */}
        <div className="left-column-container">
          {/* --- A 區: Search Terms --- */}
          <section className="card card-A">
            {/* *** 把 onPickTerm 傳下去 *** */}
            <Terms onPickTerm={handlePickTerm} /> 
          </section>

          {/* *** 移除了水平 resizer *** */}

          {/* --- B 區: Related Terms --- */}
          <section className="card card-B">
            <div className="card__title">Related Terms</div>
            {/* *** 把 onPickTerm 也傳下去 (修正點 3) *** */}
            <RelatedTerms query={query} onPickTerm={handlePickTerm} />
          </section>
        </div>
        
        {/* *** 移除了垂直 resizer *** */}

        {/* --- C 區: Studies --- */}
        <section className="card card--stack card-C">
          <QueryBuilder query={query} setQuery={setQuery} />
          <div className="divider" />
          <Studies 
            query={query} 
            isCollected={isCollected}
            addToCollection={addToCollection}
            removeFromCollection={removeFromCollection}
          />
        </section>

        {/* *** 移除了垂直 resizer *** */}

        {/* --- D 區: NiiViewer --- */}
        <section className="card card-D">
          <NiiViewer query={query} />
        </section>
      </main>
    </div>
  )
}