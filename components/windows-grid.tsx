"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { Play, ExternalLink } from "lucide-react"

export interface WindowItem {
  id: string
  title: string
  subtitle?: string
  videoId?: string
  externalUrl?: string
  thumbnailUrl?: string
}

// Windows with CORRECT labels based on actual YouTube video titles
export const windows: WindowItem[] = [
  // === AUSTRALIA (1-5) ===
  // 1. Sydney Harbour
  { id: "sydney-harbour", title: "Sydney Harbour", subtitle: "Sydney, Australia", videoId: "5uZa3-RMFos" },
  // 2. Brisbane Weather
  { id: "brisbane", title: "Brisbane Weather", subtitle: "Brisbane, Australia", videoId: "9BO8BMIN8U4" },
  // 3. Bonny Hills Beach House NSW
  { id: "bonny-hills", title: "Bonny Hills Beach House", subtitle: "NSW, Australia", videoId: "EYlLnyqjwh4" },
  // 4. Southbank Melbourne
  { id: "melbourne", title: "Southbank Melbourne", subtitle: "Melbourne, Australia", videoId: "l_8DrACHpwY" },
  // 5. Mt Lawley, Perth
  { id: "perth", title: "Mt Lawley, Perth", subtitle: "Perth, Australia", videoId: "uakxJIafWcw" },
  
  // === ICONIC CITIES & LANDMARKS (6-11) ===
  // 6. Times Square Crossroads, NYC
  { id: "times-square", title: "Times Square Crossroads", subtitle: "New York City, USA", videoId: "z-jYdOIKcTQ" },
  // 7. World Trade Center, NYC
  { id: "world-trade-center", title: "World Trade Center", subtitle: "New York City, USA", videoId: "5C9oM7C2Q9k" },
  // 8. Washington Monument, D.C.
  { id: "washington-monument", title: "Washington Monument", subtitle: "Washington, D.C., USA", videoId: "oDCAAfOSqvA" },
  // 9. Statue of Liberty
  { id: "statue-liberty", title: "Statue of Liberty", subtitle: "New York City, USA", videoId: "cWR8KGKftUw" },
  // 10. Coney Island, NYC
  { id: "coney-island", title: "Coney Island", subtitle: "New York City, USA", videoId: "H67j7H-7QD0" },
  // 11. Abbey Road Crossing, London
  { id: "abbey-road", title: "Abbey Road Crossing", subtitle: "London, England", videoId: "M3EYAY2MftI" },
  
  // === USA & JAPAN (12-13) ===
  // 12. Jackson Hole Town Square
  { id: "jackson-hole", title: "Jackson Hole Town Square", subtitle: "Wyoming, USA", videoId: "1EiC9bvVGnk" },
  // 13. Shibuya Scramble Crossing
  { id: "shibuya", title: "Shibuya Scramble Crossing", subtitle: "Tokyo, Japan", videoId: "dfVK7ld38Ys" },
  
  // === EUROPE & MIDDLE EAST (14-15) ===
  // 14. Ponte delle Guglie Venice
  { id: "venice", title: "Ponte delle Guglie Venice", subtitle: "Hotel Leone, Venice", videoId: "mt7uE-n0YPI" },
  // 15. Istanbul Galata & Kız Kulesi
  { id: "istanbul", title: "Istanbul Galata & Kiz Kulesi", subtitle: "Istanbul, Turkey", videoId: "7Gf1e8XTpHY" },
  
  // === BEACHES & TROPICAL (16-23) ===
  // 16. Los Angeles Venice Beach
  { id: "venice-beach", title: "Los Angeles Venice Beach", subtitle: "Venice V Hotel, LA", videoId: "EO_1LWqsCNE" },
  // 17. House of Sanskara, Koh Phangan
  { id: "koh-phangan", title: "House of Sanskara", subtitle: "Koh Phangan, Thailand", videoId: "FBYUkqutqzE" },
  // 18. Crystal Bay Beach Resort, Lamai Koh Samui
  { id: "crystal-bay-beach", title: "Crystal Bay Beach Resort", subtitle: "Lamai, Koh Samui, Thailand", videoId: "Fw9hgttWzIg" },
  // 19. Baobab, Lamai Koh Samui
  { id: "baobab-lamai", title: "Baobab", subtitle: "Lamai, Koh Samui, Thailand", videoId: "Tpj0cmMVOd0" },
  // 20. Nha Trang, Vietnam
  { id: "nha-trang", title: "Nha Trang", subtitle: "Vietnam", videoId: "SCpZOgLKVfY" },
  // 21. Sint Maarten, Philipsburg
  { id: "sint-maarten", title: "Sint Maarten", subtitle: "Philipsburg, Caribbean", videoId: "IQNldL1LNzc" },
  // 22. Tamariu, Spain
  { id: "tamariu", title: "Tamariu", subtitle: "Costa Brava, Spain", videoId: "PMhVgTcDd1o" },
  // 23. Sitka, Alaska
  { id: "sitka", title: "Sitka, Alaska", subtitle: "Alaska, USA", videoId: "sF5hFDGN20Y" },
  
  // === VOLCANOES & NATURE (24-29) ===
  // 24. Yellowstone National Park
  { id: "yellowstone", title: "Yellowstone National Park", subtitle: "Old Faithful Geyser", videoId: "dN1uDn-Luno" },
  // 25. Niagara Falls
  { id: "niagara-falls", title: "Niagara Falls", subtitle: "Ontario / New York", videoId: "qx7gry390YA" },
  // 26. Snowman Cam, Gaylord Michigan
  { id: "snowman-cam", title: "Snowman Cam", subtitle: "Animals & Wildlife - Gaylord, Michigan", videoId: "y96JqPFif64" },
  // 27. Semeru Volcano Indonesia
  { id: "semeru", title: "Semeru Volcano", subtitle: "Indonesia", videoId: "CrVq7vy-fPE" },
  // 28. Iceberg Ilulissat Greenland
  { id: "greenland", title: "Iceberg Ilulissat", subtitle: "Greenland", videoId: "h8O0UXsL7uk" },
  // 29. Kilauea Volcano Hawaii
  { id: "kilauea", title: "Kilauea Volcano", subtitle: "Hawaii, USA", videoId: "6IaMqotNF_s" },
  
  // === NORTHERN LIGHTS & SPACE (30-33) ===
  // 30. Aurora Borealis
  { id: "aurora", title: "Aurora Borealis", subtitle: "Utsjoki, Finland", videoId: "9TjOeBK14-I" },
  // 31. Northern Lights Fairbanks Alaska
  { id: "fairbanks-aurora", title: "Northern Lights Fairbanks", subtitle: "Alaska, USA", videoId: "O52zDyxg5QI" },
  // 32. Earth from Space
  { id: "iss-earth", title: "Earth from Space", subtitle: "ISS Live 4K", videoId: "fO9e9jnhYK8" },
  // 33. Earth from the International Space Station
  { id: "iss-live", title: "Earth from ISS", subtitle: "International Space Station", videoId: "OKQEMp2555A" },
  
  // === WILDLIFE (34-41) ===
  // 34. Awaji Island Monkey Center
  { id: "awaji-monkey", title: "Awaji Island Monkey Center", subtitle: "Awaji Island, Japan", videoId: "lsxYH2XQQCg" },
  // 35. Furball Farm Cat Sanctuary
  { id: "furball-farm", title: "Furball Farm Cat Sanctuary", subtitle: "Minnesota, USA", videoId: "e9C9K8ltDfk" },
  // 36. Namibia Waterhole
  { id: "namibia", title: "Namibia Waterhole", subtitle: "Wildlife Watch - Africa", videoId: "ydYDqZQpim8" },
  // 37. Anacapa Island Cove
  { id: "anacapa", title: "Anacapa Island Cove", subtitle: "Channel Islands National Park", videoId: "fAS2TFePbQk" },
  // 38. Coral City Camera
  { id: "coral-city", title: "Coral City Camera", subtitle: "Miami Underwater Reef", videoId: "7i8ARjIeM2k" },
  // 39. Underwater Reef Cam
  { id: "underwater", title: "Underwater Reef Cam", subtitle: "Utopia Village, Honduras", videoId: "1zcIUk66HX4" },
  // 40. African Safari
  { id: "kenya-safari", title: "African Safari", subtitle: "Kenya Wildlife - MPALA", videoId: "LC-DK_22eK4" },
  // 41. Watering Hole
  { id: "kenya-waterhole", title: "Watering Hole", subtitle: "Kenya - MPALA", videoId: "oORXfTviuCs" },
  
  // === AMBIENT VIDEOS (42-44) ===
  // 42. Cozy Fireplace
  { id: "fireplace", title: "Cozy Fireplace", subtitle: "10 Hours Full HD", videoId: "L_LUpnjgPso" },
  // 43. Woodland Ambience
  { id: "woodland", title: "Woodland Ambience", subtitle: "Forest Sounds & Bird Song", videoId: "xNN7iTA57jM" },
  // 44. Redwood Forest
  { id: "redwood", title: "Redwood Forest", subtitle: "California Stream Ambience", videoId: "_1nnhg3JpwM" },
  
  // === EXTERNAL LINKS (45-48) ===
  // 45. Random Window Swap
  { id: "window-swap", title: "Random Window Swap", subtitle: "Global Community Portal", externalUrl: "https://www.window-swap.com/window", thumbnailUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=320&h=180&fit=crop" },
  // 46. City Drive & Radio
  { id: "drive-listen", title: "City Drive & Radio", subtitle: "Immersive City Streets", externalUrl: "https://driveandlisten.app/", thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=320&h=180&fit=crop" },
  // 47. Virtual Walking Tour
  { id: "walking-tour", title: "Virtual Walking Tour", subtitle: "100+ Cities & Locations", externalUrl: "https://virtualvacation.us/walk", thumbnailUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&h=180&fit=crop" },
  // 48. Airplane City Flyover
  { id: "flyover", title: "Airplane City Flyover", subtitle: "Easygoing Expedition", externalUrl: "https://virtualvacation.us/fly", thumbnailUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=320&h=180&fit=crop" },
]

// Live streams for kiosk mode (first 41 windows - all live webcams/streams, excluding ambient videos and external links)
export const liveStreamWindows = windows.slice(0, 41)

// Get YouTube thumbnail URL
function getThumbnailUrl(window: WindowItem): string {
  if (window.thumbnailUrl) return window.thumbnailUrl
  if (window.videoId) return `https://img.youtube.com/vi/${window.videoId}/mqdefault.jpg`
  return ""
}

interface WindowsGridProps {
  kioskMode: boolean
  currentKioskIndex: number
  onWindowSelect: (window: WindowItem | null) => void
}

export function WindowsGrid({ kioskMode, currentKioskIndex, onWindowSelect }: WindowsGridProps) {
  const [selectedWindow, setSelectedWindow] = useState<WindowItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleWindowClick = useCallback((window: WindowItem) => {
    // External links open in new tab
    if (window.externalUrl) {
      globalThis.open(window.externalUrl, "_blank")
      return
    }
    setSelectedWindow(window)
    onWindowSelect(window)
  }, [onWindowSelect])

  const handleClose = useCallback(() => {
    setSelectedWindow(null)
    setIsFullscreen(false)
    onWindowSelect(null)
  }, [onWindowSelect])

  // In kiosk mode, cycle through only the live stream windows (excludes ambient videos and external links)
  const activeWindow = kioskMode ? liveStreamWindows[currentKioskIndex % liveStreamWindows.length] : selectedWindow

  return (
    <div className="flex flex-col gap-6">
      {/* Instructions */}
      {!activeWindow && (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Select a Window
          </p>
        </div>
      )}

      {/* Video Player - sticky so it stays visible while scrolling the grid below */}
      {activeWindow && activeWindow.videoId && (
        <div
          className={cn(
            !isFullscreen &&
              "sticky top-2 z-30 mx-auto w-full max-w-3xl rounded-lg shadow-2xl"
          )}
        >
          <VideoPlayer
            videoId={activeWindow.videoId}
            title={activeWindow.title}
            onClose={handleClose}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      )}

      {/* Windows Grid with Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {windows.map((window) => {
          const isExternal = !!window.externalUrl
          const isActive = activeWindow?.id === window.id
          // Check if this window is the currently playing kiosk window
          const isKioskActive = kioskMode && liveStreamWindows[currentKioskIndex % liveStreamWindows.length]?.id === window.id
          
          return (
            <button
              key={window.id}
              onClick={() => handleWindowClick(window)}
              className={cn(
                "window-card group relative overflow-hidden rounded-lg",
                "border-2 border-border hover:border-primary",
                "transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                isActive && "ring-2 ring-primary border-primary",
                isKioskActive && "ring-2 ring-primary border-primary"
              )}
              style={{ aspectRatio: "16/9" }}
            >
              {/* Thumbnail Image */}
              <img
                src={getThumbnailUrl(window)}
                alt={window.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              
              {/* Play/External icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  {isExternal ? (
                    <ExternalLink className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white" />
                  )}
                </div>
              </div>
              
              {/* Title and subtitle at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h2 className="text-sm font-semibold text-white text-center drop-shadow-lg leading-tight">
                  {window.title}
                </h2>
                {window.subtitle && (
                  <p className="text-xs text-white/70 text-center mt-0.5 drop-shadow">
                    {window.subtitle}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
