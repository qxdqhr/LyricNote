'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ImageIcon } from 'lucide-react';
import { logger } from '@lyricnote/shared';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/lib/i18n';

interface HomepageSection {
  id: number;
  title: string;
  description: string;
  backgroundImage: string | null;
  order: number;
}

interface ImageLoadState {
  [key: number]: 'loading' | 'loaded' | 'error';
}

export default function HomePage() {
  const { t } = useTranslation();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [imageLoadState, setImageLoadState] = useState<ImageLoadState>({});

  useEffect(() => {
    fetchSections();
  }, []);

  // 预加载图片
  useEffect(() => {
    if (sections.length > 0) {
      sections.forEach((section) => {
        if (section.backgroundImage) {
          setImageLoadState((prev) => ({ ...prev, [section.id]: 'loading' }));
          const img = new window.Image();
          img.onload = () => {
            setImageLoadState((prev) => ({ ...prev, [section.id]: 'loaded' }));
          };
          img.onerror = () => {
            setImageLoadState((prev) => ({ ...prev, [section.id]: 'error' }));
            logger.error(`图片加载失败: ${section.backgroundImage}`);
          };
          img.src = section.backgroundImage;
        }
      });
    }
  }, [sections]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/homepage-sections');
      const result = await response.json();
      if (result.success) {
        logger.info('获取首页配置成功', result.data);
        setSections(result.data);
      } else {
        logger.error('获取首页配置失败', result.error);
      }
    } catch (error) {
      logger.error('获取首页配置失败', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToNext = () => {
    if (currentSection < sections.length - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      document.getElementById(`section-${nextSection}`)?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.round(scrollPosition / windowHeight);
      setCurrentSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* 语言切换器 */}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSwitcher variant="icon" />
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('titles.welcome')}</h1>
          <p className="text-gray-600">请在后台配置首页内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 固定的语言切换器 */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher variant="icon" />
      </div>

      {sections.map((section, index) => {
        const hasImage = section.backgroundImage && imageLoadState[section.id] === 'loaded';
        const imageError = imageLoadState[section.id] === 'error';
        const imageLoading = imageLoadState[section.id] === 'loading';

        return (
          <section
            key={section.id}
            id={`section-${index}`}
            className="relative h-screen flex items-center justify-center overflow-hidden snap-start"
            style={{
              background: !hasImage
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : undefined,
            }}
          >
            {/* 背景图片 */}
            {hasImage && (
              <div className="absolute inset-0">
                <Image
                  src={section.backgroundImage!}
                  alt={section.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                  priority={index === 0}
                  unoptimized // OSS 外部图片需要 unoptimized
                  quality={90}
                />
              </div>
            )}

            {/* 图片加载中 */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">加载图片中...</p>
                </div>
              </div>
            )}

            {/* 图片加载失败 */}
            {imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>图片加载失败</p>
                  <p className="text-sm mt-2 opacity-75">{section.backgroundImage}</p>
                </div>
              </div>
            )}
            {/* 内容 */}
            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                {section.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
                {section.description}
              </p>

              {index === 0 && (
                <a
                  href="/admin"
                  className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
                >
                  {t('nav.settings')}
                </a>
              )}
            </div>

            {/* 滚动提示 */}
            {index < sections.length - 1 && (
              <button
                onClick={scrollToNext}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all z-30"
                aria-label="滚动到下一节"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            )}

            {/* 页面指示器 */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
              {sections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSection(idx);
                    document.getElementById(`section-${idx}`)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSection ? 'bg-white h-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`跳转到第 ${idx + 1} 节`}
                />
              ))}
            </div>
          </section>
        );
      })}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
