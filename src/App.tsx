import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Settings, Play, Download, Monitor, MapPin, Clock, User, Search, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

interface BrowserSession {
  id: string;
  url: string;
  ip: string;
  country: string;
  city: string;
  browser: string;
  userAgent: string;
  timestamp: string;
  resolution: string;
  language: string;
  windowRef?: Window | null;
  isOpen: boolean;
}

const countries = [
  { name: 'United States', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'] },
  { name: 'United Kingdom', code: 'GB', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Bristol'] },
  { name: 'Germany', code: 'DE', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'] },
  { name: 'France', code: 'FR', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'] },
  { name: 'Japan', code: 'JP', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Kobe', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kawasaki', 'Hiroshima'] },
  { name: 'Canada', code: 'CA', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton'] },
  { name: 'Australia', code: 'AU', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'] },
  { name: 'Spain', code: 'ES', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'] },
  { name: 'Italy', code: 'IT', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'] },
  { name: 'Brazil', code: 'BR', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'] },
  { name: 'India', code: 'IN', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'] },
  { name: 'China', code: 'CN', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing', 'Foshan'] },
  { name: 'Russia', code: 'RU', cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Kazan', 'Chelyabinsk', 'Omsk', 'Samara', 'Rostov-on-Don'] },
  { name: 'Mexico', code: 'MX', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí'] },
  { name: 'South Korea', code: 'KR', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang'] },
];

const browsers = [
  { name: 'Chrome', versions: ['120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0', '116.0.0.0', '115.0.0.0'] },
  { name: 'Firefox', versions: ['121.0', '120.0', '119.0', '118.0', '117.0', '116.0'] },
  { name: 'Safari', versions: ['17.2', '17.1', '17.0', '16.6', '16.5', '16.4'] },
  { name: 'Edge', versions: ['120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0', '116.0.0.0', '115.0.0.0'] },
  { name: 'Opera', versions: ['105.0.0.0', '104.0.0.0', '103.0.0.0', '102.0.0.0', '101.0.0.0', '100.0.0.0'] },
];

const resolutions = ['1920x1080', '1366x768', '1440x900', '1536x864', '1280x720', '2560x1440', '1600x900', '1280x1024', '1024x768', '3840x2160'];
const languages = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'pt-BR', 'it-IT', 'ru-RU', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'tr-TR', 'pl-PL'];

function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateSession(url: string, index: number): BrowserSession {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  const version = browser.versions[Math.floor(Math.random() * browser.versions.length)];
  const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
  const language = languages[Math.floor(Math.random() * languages.length)];

  const userAgents = {
    Chrome: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
    Firefox: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version}) Gecko/20100101 Firefox/${version}`,
    Safari: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Version/${version} Safari/537.36`,
    Edge: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Edg/${version}`,
    Opera: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 OPR/${version}`,
  };

  return {
    id: `session-${index}`,
    url,
    ip: generateRandomIP(),
    country: country.name,
    city,
    browser: `${browser.name} ${version}`,
    userAgent: userAgents[browser.name as keyof typeof userAgents],
    timestamp: new Date(Date.now() + Math.random() * 10000).toISOString(),
    resolution,
    language,
    windowRef: null,
    isOpen: false,
  };
}

function App() {
  const [url, setUrl] = useState('');
  const [tabCount, setTabCount] = useState(5);
  const [sessions, setSessions] = useState<BrowserSession[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tabsPerPage] = useState(50);
  const [openWindowsCount, setOpenWindowsCount] = useState(0);

  // Filter sessions based on search term
  const filteredSessions = useMemo(() => {
    if (!searchTerm) return sessions;
    return sessions.filter(session => 
      session.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ip.includes(searchTerm)
    );
  }, [sessions, searchTerm]);

  // Paginate sessions for tab display
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * tabsPerPage;
    return filteredSessions.slice(startIndex, startIndex + tabsPerPage);
  }, [filteredSessions, currentPage, tabsPerPage]);

  const totalPages = Math.ceil(filteredSessions.length / tabsPerPage);

  // Monitor window status
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(prevSessions => {
        let hasChanges = false;
        const updatedSessions = prevSessions.map(session => {
          if (session.windowRef && session.windowRef.closed && session.isOpen) {
            hasChanges = true;
            return { ...session, isOpen: false, windowRef: null };
          }
          return session;
        });
        
        if (hasChanges) {
          const openCount = updatedSessions.filter(s => s.isOpen).length;
          setOpenWindowsCount(openCount);
          return updatedSessions;
        }
        return prevSessions;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!url || tabCount < 1 || tabCount > 100000) return;
    
    setIsLoading(true);
    setProgress(0);
    const newSessions: BrowserSession[] = [];
    const batchSize = 1000;
    
    for (let i = 0; i < tabCount; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, tabCount - i);
      const batch: BrowserSession[] = [];
      
      for (let j = 0; j < currentBatchSize; j++) {
        batch.push(generateSession(url, i + j + 1));
      }
      
      newSessions.push(...batch);
      setProgress(Math.round((newSessions.length / tabCount) * 100));
      
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    setSessions(newSessions);
    setActiveTab(0);
    setCurrentPage(1);
    setIsLoading(false);
    setProgress(0);
    setOpenWindowsCount(0);
  };

  const openWindow = (session: BrowserSession, index: number) => {
    if (session.isOpen && session.windowRef && !session.windowRef.closed) {
      session.windowRef.focus();
      return;
    }

    const windowFeatures = `
      width=1200,
      height=800,
      left=${Math.random() * 200},
      top=${Math.random() * 200},
      scrollbars=yes,
      resizable=yes,
      toolbar=yes,
      menubar=yes,
      location=yes,
      status=yes
    `;

    try {
      const newWindow = window.open(session.url, `session-${session.id}`, windowFeatures);
      
      if (newWindow) {
        setSessions(prevSessions => {
          const updated = [...prevSessions];
          const sessionIndex = updated.findIndex(s => s.id === session.id);
          if (sessionIndex !== -1) {
            updated[sessionIndex] = {
              ...updated[sessionIndex],
              windowRef: newWindow,
              isOpen: true
            };
          }
          return updated;
        });
        
        setOpenWindowsCount(prev => prev + 1);
        
        // Try to modify user agent (limited by browser security)
        try {
          newWindow.document.title = `Session ${index + 1} - ${session.city}, ${session.country}`;
        } catch (e) {
          console.log('Cannot modify window properties due to CORS policy');
        }
      } else {
        alert('El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.');
      }
    } catch (error) {
      console.error('Error opening window:', error);
      alert('Error al abrir la ventana. Verifica que las ventanas emergentes estén permitidas.');
    }
  };

  const closeWindow = (session: BrowserSession) => {
    if (session.windowRef && !session.windowRef.closed) {
      session.windowRef.close();
    }
    
    setSessions(prevSessions => {
      const updated = [...prevSessions];
      const sessionIndex = updated.findIndex(s => s.id === session.id);
      if (sessionIndex !== -1) {
        updated[sessionIndex] = {
          ...updated[sessionIndex],
          windowRef: null,
          isOpen: false
        };
      }
      return updated;
    });
    
    setOpenWindowsCount(prev => Math.max(0, prev - 1));
  };

  const openAllWindows = async () => {
    const maxConcurrent = 10; // Limit concurrent window opening
    const delay = 500; // Delay between batches
    
    for (let i = 0; i < filteredSessions.length; i += maxConcurrent) {
      const batch = filteredSessions.slice(i, i + maxConcurrent);
      
      batch.forEach((session, batchIndex) => {
        if (!session.isOpen) {
          setTimeout(() => {
            openWindow(session, i + batchIndex);
          }, batchIndex * 100); // Stagger within batch
        }
      });
      
      if (i + maxConcurrent < filteredSessions.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const closeAllWindows = () => {
    sessions.forEach(session => {
      if (session.isOpen) {
        closeWindow(session);
      }
    });
  };

  const handleExport = () => {
    const exportData = sessions.map(session => ({
      ...session,
      windowRef: undefined, // Remove window reference for JSON export
    }));
    
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-sessions-${sessions.length}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTabClick = (sessionIndex: number) => {
    const globalIndex = (currentPage - 1) * tabsPerPage + sessionIndex;
    setActiveTab(globalIndex);
  };

  const getActiveSession = () => {
    return filteredSessions[activeTab] || sessions[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Simulador de Pestañas Múltiples</h1>
          <p className="text-slate-300 text-lg">Genera hasta 100,000 sesiones de navegador con ventanas reales</p>
          {openWindowsCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
              <ExternalLink className="w-4 h-4" />
              {openWindowsCount} ventanas abiertas
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">URL del Sitio Web</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Número de Sesiones (1-100,000)</label>
              <div className="relative">
                <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={tabCount}
                  onChange={(e) => setTabCount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleGenerate}
              disabled={!url || isLoading || tabCount < 1 || tabCount > 100000}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              {isLoading ? `Generando... ${progress}%` : 'Generar Sesiones'}
            </button>
            
            {sessions.length > 0 && (
              <>
                <button
                  onClick={openAllWindows}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Abrir Todas las Ventanas
                </button>
                
                <button
                  onClick={closeAllWindows}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cerrar Todas las Ventanas
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20"
                >
                  <Download className="w-5 h-5" />
                  Exportar {sessions.length.toLocaleString()} Sesiones
                </button>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="mt-4">
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-slate-300 text-sm mt-2">
                Generadas {Math.floor((progress / 100) * tabCount).toLocaleString()} de {tabCount.toLocaleString()} sesiones
              </p>
            </div>
          )}
        </div>

        {/* Sessions Display */}
        {sessions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            {/* Search and Stats */}
            <div className="p-4 bg-white/5 border-b border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por país, ciudad, navegador o IP..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                    />
                  </div>
                  <div className="text-slate-300 text-sm">
                    {filteredSessions.length.toLocaleString()} sesiones
                    {searchTerm && ` (filtradas de ${sessions.length.toLocaleString()})`}
                  </div>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-white text-sm px-3">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto bg-white/5 p-2 scrollbar-hide">
              {paginatedSessions.map((session, index) => {
                const globalIndex = (currentPage - 1) * tabsPerPage + index;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleTabClick(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all min-w-fit relative ${
                      activeTab === globalIndex
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Sesión {globalIndex + 1}
                    {session.isOpen && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Session Details */}
            {getActiveSession() && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Session Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        Sesión {activeTab + 1} Detalles
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openWindow(getActiveSession(), activeTab)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {getActiveSession().isOpen ? 'Enfocar' : 'Abrir'}
                        </button>
                        {getActiveSession().isOpen && (
                          <button
                            onClick={() => closeWindow(getActiveSession())}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            <X className="w-4 h-4" />
                            Cerrar
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-white font-medium">Ubicación</div>
                          <div className="text-slate-300 text-sm">{getActiveSession().city}, {getActiveSession().country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-white font-medium">Dirección IP</div>
                          <div className="text-slate-300 text-sm font-mono">{getActiveSession().ip}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-white font-medium">Navegador</div>
                          <div className="text-slate-300 text-sm">{getActiveSession().browser}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="text-white font-medium">Resolución</div>
                          <div className="text-slate-300 text-sm">{getActiveSession().resolution}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-pink-400" />
                        <div>
                          <div className="text-white font-medium">Marca de Tiempo</div>
                          <div className="text-slate-300 text-sm">{new Date(getActiveSession().timestamp).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-white font-medium">Idioma</div>
                          <div className="text-slate-300 text-sm">{getActiveSession().language}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">URL de Destino</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Globe className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">URL:</span>
                        </div>
                        <a 
                          href={getActiveSession().url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 break-all underline"
                        >
                          {getActiveSession().url}
                        </a>
                        <div className="mt-4 p-3 bg-slate-700 rounded border">
                          <p className="text-slate-300 text-sm">
                            <strong>Nota:</strong> Las ventanas se abren directamente en tu navegador. 
                            Cada sesión simula un usuario diferente con ubicación, navegador e IP únicos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Agent */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-2">Cadena User Agent</h4>
                  <div className="bg-slate-800 rounded-lg p-3 border border-white/20">
                    <code className="text-green-400 text-sm break-all">{getActiveSession().userAgent}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-white">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Generando {tabCount.toLocaleString()} sesiones de navegador... {progress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;