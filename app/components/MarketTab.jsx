'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, ChevronDown, ChevronRight, LogIn, Lock, TrendingUp, BarChart3, Activity, ArrowDown, ArrowUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFundValuationRanking } from '../api/fund';
import { cn } from '@/lib/utils';
import { useStorageStore, useUserStore, useModalStore } from '../stores';
import { supabase } from '../lib/supabase';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Empty, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '../hooks/useIsMobile';

export default function MarketTab() {
  const [activeTab, setActiveTab] = useState('increase'); // increase, decrease, hot
  const [sectorFilter, setSectorFilter] = useState('industry'); // industry, concept
  const [sectorSort, setSectorSort] = useState('change_pct'); // change_pct, net_inflow
  const [sectorSortOrder, setSectorSortOrder] = useState('desc'); // desc, asc
  const user = useUserStore((s) => s.user);
  const isMobile = useIsMobile();
  
  // Storage for favorites
  const favorites = useStorageStore((s) => s.favorites);
  const toggleFavorite = useStorageStore((s) => s.toggleFavorite);

  // Queries for Hot Sectors (Supabase)
  const { data: sectorEstimates } = useQuery({
    queryKey: ['hotSectors'],
    queryFn: async () => {
      try {
        if (!supabase) return [];
        const { data, error } = await supabase.from('fund_topic').select('*');
        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error('Fetch hot sectors error:', e);
        return [];
      }
    },
    refetchInterval: 300000,
  });

  const filteredAndSortedSectors = useMemo(() => {
    if (!sectorEstimates) return [];
    
    let result = sectorEstimates;
    if (sectorFilter !== 'all') {
      result = result.filter(s => s.sector_type === sectorFilter);
    }
    
    result = [...result].sort((a, b) => {
      const valA = a[sectorSort] || 0;
      const valB = b[sectorSort] || 0;
      return sectorSortOrder === 'desc' ? valB - valA : valA - valB;
    });
    
    return result.slice(0, isMobile ? 4 : 10);
  }, [sectorEstimates, sectorFilter, sectorSort, sectorSortOrder, isMobile]);

  // Query for Valuation Ranking
  const { data: rankingData, isFetching: rankingFetching } = useQuery({
    queryKey: ['valuationRanking', activeTab],
    queryFn: async () => {
      let sort = 3;
      let order = 'desc';
      
      if (activeTab === 'decrease') {
        sort = 3;
        order = 'asc';
      } else if (activeTab === 'hot') {
        sort = 4; // Using sort=4 for pseudo trading volume
        order = 'desc';
      }
      
      const res = await fetchFundValuationRanking(sort, order, 1, 20);
      return res?.Data?.list || [];
    },
    refetchInterval: 60000,
  });

  const formatPercent = (val) => {
    const num = Number(val);
    if (!Number.isFinite(num)) return '0.00%';
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getColorClass = (val) => {
    const num = parseFloat(val);
    if (!Number.isFinite(num) || num === 0) return 'text-[var(--foreground)]';
    return num > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]';
  };

  return (
    <div className="market-tab-container flex flex-col min-h-[60vh]">
      {!user ? (
        <div className="flex-1 w-full flex flex-col items-center justify-start sm:justify-center px-4 pt-4 pb-12 sm:p-6 my-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Removed background decorative blurs per user request */}
            
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-primary/20 relative z-10">
              <Lock className="size-8" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground relative z-10 tracking-tight">需要登录解锁行情</h3>
            
            <p className="text-sm text-muted-foreground mb-8 relative z-10 leading-relaxed">
              登录后即可查看实时热门板块、资金流入排行及大盘估值数据，快来探索更多专属功能吧。
            </p>
            
            {/* Feature list */}
            <div className="w-full flex flex-col gap-3 mb-8 relative z-10 text-left">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-xl border border-border/50">
                <div className="bg-background/80 p-1.5 rounded-lg shadow-sm border border-border/50">
                  <TrendingUp className="size-4 text-[var(--danger)]" />
                </div>
                <span>实时热门板块追踪</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-xl border border-border/50">
                <div className="bg-background/80 p-1.5 rounded-lg shadow-sm border border-border/50">
                  <Activity className="size-4 text-blue-500" />
                </div>
                <span>主力资金流入分析</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-xl border border-border/50">
                <div className="bg-background/80 p-1.5 rounded-lg shadow-sm border border-border/50">
                  <BarChart3 className="size-4 text-[var(--success)]" />
                </div>
                <span>全市场估值涨跌榜单</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full relative z-10 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5 rounded-xl h-12 text-base font-medium"
              onClick={() => useModalStore.setState({ loginModalOpen: true })}
            >
              <LogIn className="size-5 mr-2" />
              立即登录 / 注册
            </Button>
          </motion.div>
        </div>
      ) : (
        <>
          {/* 热门板块 */}
          <div className="market-section">
            <div className="market-section-header">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="market-section-title whitespace-nowrap flex-shrink-0">热门板块</h2>
                <ToggleGroup 
                  type="single" 
                  value={sectorFilter} 
                  onValueChange={(v) => v && setSectorFilter(v)}
                  className="bg-black/5 dark:bg-white/10 p-0.5 rounded-md border border-black/5 dark:border-white/5 gap-0 shadow-inner"
                >
                  <ToggleGroupItem 
                    value="industry" 
                    className="h-6 px-2 text-[10px] rounded-sm border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all cursor-pointer"
                  >行业</ToggleGroupItem>
                  <ToggleGroupItem 
                    value="concept" 
                    className="h-6 px-2 text-[10px] rounded-sm border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all cursor-pointer"
                  >概念</ToggleGroupItem>
                </ToggleGroup>
                
                <ToggleGroup 
                  type="single" 
                  value={sectorSort} 
                  onValueChange={(v) => {
                    if (!v) {
                      setSectorSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                    } else {
                      setSectorSort(v);
                      setSectorSortOrder('desc');
                    }
                  }}
                  className="bg-black/5 dark:bg-white/10 p-0.5 rounded-md border border-black/5 dark:border-white/5 gap-0 shadow-inner"
                >
                  <ToggleGroupItem 
                    value="change_pct" 
                    className="h-6 px-2 text-[10px] flex items-center gap-0.5 rounded-sm border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all cursor-pointer"
                  >
                    按涨幅
                    {sectorSort === 'change_pct' && (
                      sectorSortOrder === 'desc' ? <ArrowDown className="w-1 h-1 shrink-0" strokeWidth={1.5} /> : <ArrowUp className="w-1 h-1 shrink-0" strokeWidth={1.5} />
                    )}
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="net_inflow" 
                    className="h-6 px-2 text-[10px] flex items-center gap-0.5 rounded-sm border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all cursor-pointer"
                  >
                    按资金流入
                    {sectorSort === 'net_inflow' && (
                      sectorSortOrder === 'desc' ? <ArrowDown className="w-1 h-1 shrink-0" strokeWidth={1.5} /> : <ArrowUp className="w-1 h-1 shrink-0" strokeWidth={1.5} />
                    )}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <button className="market-section-more">全部 <ChevronRight size={14} /></button>
            </div>
            
            <div className="market-sector-grid">
              {filteredAndSortedSectors?.map(sector => {
                const pctStr = sector.change_pct != null ? String(sector.change_pct) : '0.00';
                const pctNum = parseFloat(pctStr);
                const isUp = pctNum > 0;
                const isDown = pctNum < 0;
                
                return (
                  <div key={sector.id || sector.sector_id} className="market-sector-card glass">
                    <div className="market-sector-main">
                      <span className="market-sector-name">{sector.sector_name}</span>
                      {sectorSort === 'change_pct' ? (
                        <span className={cn("market-sector-pct", getColorClass(pctStr))}>
                          {formatPercent(pctStr)}
                        </span>
                      ) : (
                        <span className={cn("market-sector-pct", getColorClass(sector.net_inflow))}>
                          {sector.net_inflow ? (sector.net_inflow / 100000000).toFixed(2) + '亿' : '--'}
                        </span>
                      )}
                    </div>
                    <div className="market-sector-leader">
                      {sectorSort === 'change_pct' ? (
                        <>资金流入: {sector.net_inflow ? (sector.net_inflow / 100000000).toFixed(2) + '亿' : '--'}</>
                      ) : (
                        <>涨跌幅: <span className={getColorClass(pctStr)}>{formatPercent(pctStr)}</span></>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 榜单栏 */}
          <div className="market-ranking-section glass">
            <div className="market-ranking-tabs">
              <button 
                className={cn("market-ranking-tab", activeTab === 'increase' && "active")}
                onClick={() => setActiveTab('increase')}
              >
                估值涨幅
              </button>
              <button 
                className={cn("market-ranking-tab", activeTab === 'decrease' && "active")}
                onClick={() => setActiveTab('decrease')}
              >
                估值跌幅
              </button>
              <button 
                className={cn("market-ranking-tab", activeTab === 'hot' && "active")}
                onClick={() => setActiveTab('hot')}
              >
                成交热度
              </button>
              <div className="flex-1" />
              <button className="market-ranking-filter">
                <Filter size={16} />
              </button>
            </div>

            <div className="market-ranking-table">
              <div className="market-ranking-header">
                <div className="market-ranking-col-name"><Filter size={14} className="inline mr-1" />基金名称或代码</div>
                <div className="market-ranking-col-val">最新涨幅</div>
                <div className="market-ranking-col-val">估算涨幅 <ChevronDown size={12} className="inline" /></div>
              </div>

              <div className="market-ranking-list">
                {rankingFetching ? (
                  <div className="py-8 text-center text-sm opacity-50">加载中...</div>
                ) : rankingData?.map(fund => {
                  const isFav = favorites?.has?.(fund.bzdm);
                  
                  return (
                    <div key={fund.bzdm} className="market-ranking-row">
                      <div className="market-ranking-col-name truncate-content">
                        <div className="flex items-center gap-1.5 mb-1">
                          <button 
                            onClick={() => toggleFavorite && toggleFavorite(fund.bzdm)}
                            className={cn("focus:outline-none flex-shrink-0", isFav ? "text-yellow-500" : "text-gray-400 opacity-50")}
                          >
                            <Star size={16} fill={isFav ? "currentColor" : "none"} />
                          </button>
                          <span className="font-medium text-sm truncate">{fund.jjjc}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          <span className="text-xs opacity-50">#{fund.bzdm}</span>
                          {fund.FType && (
                            <span className="fund-tag text-[10px] px-1 rounded-sm opacity-60 border border-current">
                              {fund.FType.split('-')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="market-ranking-col-val flex flex-col items-end justify-center">
                        <span className={cn("text-sm font-medium", getColorClass(fund.jzzzl))}>
                          {formatPercent(fund.jzzzl)}
                        </span>
                        <span className="text-xs opacity-50 mt-0.5">{fund.gxrq?.slice(5)}</span>
                      </div>
                      
                      <div className="market-ranking-col-val flex flex-col items-end justify-center">
                        <span className={cn("text-sm font-bold", getColorClass(fund.gszzl))}>
                          {formatPercent(fund.gszzl)}
                        </span>
                        <span className="text-xs opacity-50 mt-0.5">{fund.gzrq?.slice(5)} {fund.gztime?.slice(11, 16)}</span>
                      </div>
                    </div>
                  );
                })}
                
                {rankingData?.length === 0 && !rankingFetching && (
                  <div className="py-8 text-center text-sm opacity-50">暂无数据</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
