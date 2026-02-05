"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" },
  { href: "/faq", label: "FAQ" },
];

export function DynamicIsland() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [currentPos, setCurrentPos] = useState({ left: 0, width: 0 });
  const [targetPos, setTargetPos] = useState({ left: 0, width: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isOnButton, setIsOnButton] = useState(false);
  const animationRef = useRef<number | null>(null);

  const activeIndex = navItems.findIndex((item) => item.href === pathname);

  // ボタンの位置情報を取得
  const getItemPositions = useCallback(() => {
    return itemRefs.current.map((item) => {
      if (!item) return { left: 0, width: 0, center: 0, right: 0 };
      const left = item.offsetLeft;
      const width = item.offsetWidth;
      return {
        left,
        width,
        center: left + width / 2,
        right: left + width,
      };
    });
  }, []);

  // アクティブなボタンの位置を取得
  const getActivePosition = useCallback(() => {
    const positions = getItemPositions();
    if (activeIndex >= 0 && positions[activeIndex]) {
      return positions[activeIndex];
    }
    return null;
  }, [activeIndex, getItemPositions]);

  // 初期化
  useEffect(() => {
    const pos = getActivePosition();
    if (pos) {
      setCurrentPos({ left: pos.left, width: pos.width });
      setTargetPos({ left: pos.left, width: pos.width });
      setOpacity(1);
    }
  }, [getActivePosition]);

  // マウス位置に基づいてターゲット位置を更新
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const nav = navRef.current;
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const mouseX = e.clientX - navRect.left;
    const positions = getItemPositions();

    if (positions.length === 0) return;

    const avgWidth = positions.reduce((sum, p) => sum + p.width, 0) / positions.length;
    const firstPos = positions[0];
    const lastPos = positions[positions.length - 1];
    const minLeft = firstPos.left;
    const maxLeft = lastPos.right - avgWidth;

    // マウス位置ベースの基本位置
    let baseLeft = mouseX - avgWidth / 2;
    baseLeft = Math.max(minLeft, Math.min(maxLeft, baseLeft));

    // ボタンの上にいるかチェック
    let onButton = false;
    let buttonPos = null;
    for (const pos of positions) {
      if (mouseX >= pos.left && mouseX <= pos.right) {
        onButton = true;
        buttonPos = pos;
        break;
      }
    }

    setIsOnButton(onButton);

    if (onButton && buttonPos) {
      // ボタンの上にいる場合はボタン位置に合わせる（位置は正確に、遷移は滑らかに）
      setTargetPos({ left: buttonPos.left, width: buttonPos.width });
    } else {
      // ボタン間にいる場合はマウスに追従
      setTargetPos({ left: baseLeft, width: avgWidth });
    }
  }, [getItemPositions]);

  // スムーズアニメーション（lerp）- より滑らかに
  useEffect(() => {
    const animate = () => {
      setCurrentPos((prev) => {
        // ホバー中はより追従、離れたらゆっくり戻る
        const lerpFactor = isHovering ? 0.15 : 0.1;

        const diffLeft = targetPos.left - prev.left;
        const diffWidth = targetPos.width - prev.width;

        // 差が小さければそのまま
        if (Math.abs(diffLeft) < 0.1 && Math.abs(diffWidth) < 0.1) {
          return { left: targetPos.left, width: targetPos.width };
        }

        return {
          left: prev.left + diffLeft * lerpFactor,
          width: prev.width + diffWidth * lerpFactor,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, targetPos]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsOnButton(false);
    // アクティブなボタンに戻る
    const pos = getActivePosition();
    if (pos) {
      setTargetPos({ left: pos.left, width: pos.width });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="dynamic-island px-3 py-2 flex items-center gap-1">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-1 rounded-full"
        >
          <Image
            src="/images/icon.png"
            alt="すみれさば"
            width={28}
            height={28}
            className="rounded-full"
          />
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/20 mx-1" />

        {/* Navigation Links with Sliding Indicator */}
        <div
          ref={navRef}
          className="relative flex items-center gap-0.5"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Sliding Background Indicator */}
          <div
            className="absolute top-0 h-full rounded-full bg-white/20 pointer-events-none"
            style={{
              left: currentPos.left,
              width: currentPos.width,
              opacity: opacity,
              transform: isOnButton ? 'scale(1.03)' : isHovering ? 'scale(1.01)' : 'scale(1)',
              transition: 'transform 0.2s ease-out, opacity 0.3s ease-out',
            }}
          />

          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => { itemRefs.current[index] = el; }}
                className={`
                  relative z-10 px-4 py-1.5 rounded-full text-sm font-medium
                  transition-colors duration-200 ease-out
                  active:scale-95
                  ${isActive ? "text-white" : "text-white/70 hover:text-white"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
