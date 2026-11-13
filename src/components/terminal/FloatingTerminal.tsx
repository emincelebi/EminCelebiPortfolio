import React, { useState, useEffect, useRef } from 'react';
import type { GameType, CommandHistory } from '../terminal/terminalTypes';
import { SnakeGame, InvadersGame, TicTacToeGame } from '../terminal/TerminalGames';

const COMMAND_LIST = [
  'help', 'about', 'skills', 'projects', 'experience', 
  'contact', 'stack', 'github', 'neofetch', 'stats', 
  'game', 'snake', 'invaders', 'tictactoe', 'hack', 'message', 'sudo hire emin', 'clear'
];

const GRID_W = 24;
const GRID_H = 11;

export const FloatingTerminal: React.FC = () => {
  const [pos, setPos] = useState({ x: 96, y: 85 });
  const [side, setSide] = useState<'right' | 'top' | 'left' | 'bottom'>('right');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState('');

  const [activeGame, setActiveGame] = useState<GameType>('menu');

  const [hackTarget, setHackTarget] = useState(0);
  const [hackAttempts, setHackAttempts] = useState(5);

  const [snakePos, setSnakePos] = useState([{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
  const [foodPos, setFoodPos] = useState({ x: 15, y: 5 });
  const [snakeDir, setSnakeDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeGameOver, setSnakeGameOver] = useState(false);

  const [shipX, setShipX] = useState(11);
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([]);
  const [invadersScore, setInvadersScore] = useState(0);
  const [invadersOver, setInvadersOver] = useState(false);

  const [tttBoard, setTttBoard] = useState<string[]>(Array(9).fill(''));
  const [tttTurn, setTttTurn] = useState<'X' | 'O'>('X');
  const [tttWinner, setTttWinner] = useState<string | null>(null);

  const [messageState, setMessageState] = useState<'idle' | 'step_name' | 'step_email' | 'step_msg'>('idle');
  const [tempMsgData, setTempMsgData] = useState({ name: '', email: '', message: '' });

  const [history, setHistory] = useState<CommandHistory[]>([
    { 
      command: '/init', 
      output: 'EminOS v6.3 Aktif.', 
      type: 'info' 
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const wavePhaseRef = useRef<number>(0);

  const isExpanded = isHovered || isFocused;

  useEffect(() => {
    if (isExpanded) return;

    let animationFrameId: number;
    const speed = 0.08;
    const leftEdge = 3.5;
    const rightEdge = 96.5;
    const topEdge = 14;
    const bottomEdge = 94.5;
    const waveAmplitude = 1.4;
    const waveFrequency = 0.05;

    const patrolPerimeter = () => {
      wavePhaseRef.current += waveFrequency;
      const waveOffset = Math.sin(wavePhaseRef.current) * waveAmplitude;

      setPos((prev) => {
        let { x, y } = prev;

        if (side === 'right') {
          y -= speed;
          x = rightEdge + waveOffset;
          if (y <= topEdge) { y = topEdge; setSide('top'); }
        } else if (side === 'top') {
          x -= speed;
          y = topEdge + waveOffset;
          if (x <= leftEdge) { x = leftEdge; setSide('left'); }
        } else if (side === 'left') {
          y += speed;
          x = leftEdge + waveOffset;
          if (y >= bottomEdge) { y = bottomEdge; setSide('bottom'); }
        } else if (side === 'bottom') {
          x += speed;
          y = bottomEdge + waveOffset;
          if (x >= rightEdge) { x = rightEdge; setSide('right'); }
        }

        return { x, y };
      });

      animationFrameId = requestAnimationFrame(patrolPerimeter);
    };

    animationFrameId = requestAnimationFrame(patrolPerimeter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isExpanded, side]);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, isExpanded, activeGame]);

  useEffect(() => {
    if (activeGame !== 'snake' || snakeGameOver) return;

    const interval = setInterval(() => {
      setSnakePos((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (snakeDir === 'UP') head.y -= 1;
        if (snakeDir === 'DOWN') head.y += 1;
        if (snakeDir === 'LEFT') head.x -= 1;
        if (snakeDir === 'RIGHT') head.x += 1;

        if (
          head.x < 0 || head.x >= GRID_W ||
          head.y < 0 || head.y >= GRID_H ||
          prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
          setSnakeGameOver(true);
          return prevSnake;
        }

        if (head.x === foodPos.x && head.y === foodPos.y) {
          setSnakeScore((s) => s + 10);
          setFoodPos({
            x: Math.floor(Math.random() * GRID_W),
            y: Math.floor(Math.random() * GRID_H),
          });
          return [head, ...prevSnake];
        }

        const newSnake = [head, ...prevSnake];
        newSnake.pop();
        return newSnake;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [activeGame, snakeDir, foodPos, snakeGameOver]);

  useEffect(() => {
    if (activeGame !== 'invaders' || invadersOver) return;

    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;

      setBullets((prevB) =>
        prevB.map((b) => ({ x: b.x, y: b.y - 1 })).filter((b) => b.y >= 0)
      );

      setEnemies((prevE) => {
        let updated = prevE;
        if (tick % 3 === 0) {
          updated = prevE.map((e) => ({ x: e.x, y: e.y + 1 }));
        }
        if (tick % 6 === 0) {
          updated = [...updated, { x: Math.floor(Math.random() * GRID_W), y: 0 }];
        }

        if (updated.some((e) => e.y >= GRID_H - 1)) {
          setInvadersOver(true);
        }
        return updated;
      });

      setBullets((currB) => {
        setEnemies((currE) => {
          const hitEnemyIndices = new Set<number>();
          const hitBulletIndices = new Set<number>();

          currB.forEach((b, bIdx) => {
            currE.forEach((e, eIdx) => {
              if (b.x === e.x && Math.abs(b.y - e.y) <= 1) {
                hitEnemyIndices.add(eIdx);
                hitBulletIndices.add(bIdx);
              }
            });
          });

          if (hitEnemyIndices.size > 0) {
            setInvadersScore((s) => s + hitEnemyIndices.size * 15);
            return currE.filter((_, idx) => !hitEnemyIndices.has(idx));
          }
          return currE;
        });
        return currB;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [activeGame, invadersOver]);

  // Bilgisayar Hamlesi (XOX AI)
  useEffect(() => {
    if (activeGame !== 'tictactoe' || tttTurn !== 'O' || tttWinner) return;

    const timer = setTimeout(() => {
      const emptyIndices = tttBoard
        .map((val, idx) => (val === '' ? idx : null))
        .filter((val) => val !== null) as number[];

      if (emptyIndices.length === 0) return;

      let moveIdx = -1;

      // 1. Bilgisayar kazanabiliyorsa hamle yap
      for (let idx of emptyIndices) {
        const testBoard = [...tttBoard];
        testBoard[idx] = 'O';
        if (checkTttWinner(testBoard) === 'O') {
          moveIdx = idx;
          break;
        }
      }

      // 2. Oyuncu kazanacaksa engelle
      if (moveIdx === -1) {
        for (let idx of emptyIndices) {
          const testBoard = [...tttBoard];
          testBoard[idx] = 'X';
          if (checkTttWinner(testBoard) === 'X') {
            moveIdx = idx;
            break;
          }
        }
      }

      // 3. Rastgele boş bir yere oyna
      if (moveIdx === -1) {
        moveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }

      const newBoard = [...tttBoard];
      newBoard[moveIdx] = 'O';
      setTttBoard(newBoard);

      const win = checkTttWinner(newBoard);
      if (win) {
        setTttWinner(win);
      } else {
        setTttTurn('X');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeGame, tttTurn, tttBoard, tttWinner]);

  const startSnakeGame = () => {
    setSnakePos([{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
    setFoodPos({ x: 15, y: 5 });
    setSnakeDir('RIGHT');
    setSnakeScore(0);
    setSnakeGameOver(false);
    setActiveGame('snake');
  };

  const startInvadersGame = () => {
    setShipX(11);
    setBullets([]);
    setEnemies([{ x: 5, y: 0 }, { x: 12, y: 1 }, { x: 18, y: 0 }]);
    setInvadersScore(0);
    setInvadersOver(false);
    setActiveGame('invaders');
  };

  const startTicTacToe = () => {
    setTttBoard(Array(9).fill(''));
    setTttTurn('X');
    setTttWinner(null);
    setActiveGame('tictactoe');
  };

  const checkTttWinner = (boardState: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    if (boardState.every((cell) => cell !== '')) return 'DRAW';
    return null;
  };

  const handleTttCellClick = (idx: number) => {
    if (tttBoard[idx] !== '' || tttWinner || tttTurn !== 'X') return;
    const newBoard = [...tttBoard];
    newBoard[idx] = 'X';
    setTttBoard(newBoard);

    const win = checkTttWinner(newBoard);
    if (win) {
      setTttWinner(win);
    } else {
      setTttTurn('O');
    }
  };

  const navigateToSection = (sectionId: string, label: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return { output: `Yönlendiriliyor: ${label}...`, type: 'success' as const };
    }
    return { output: `Hata: "#${sectionId}" bölümü bulunamadı.`, type: 'error' as const };
  };

  const executeCommand = (cmdStr: string) => {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase().replace(/^\//, '');
    let responseOutput: React.ReactNode = '';
    let responseType: 'info' | 'success' | 'error' | 'ascii' = 'info';

    if (activeGame !== 'menu') {
      if (cmd === 'exit' || cmd === 'cikis') {
        setActiveGame('menu');
        setHistory((prev) => [...prev, { command: rawCmd, output: 'Oyun modundan çıkıldı. "game" yazarak menüye dönebilirsin.', type: 'info' }]);
        setInput('');
        return;
      }

      if (cmd === 'restart' || cmd === 'tekrar') {
        if (activeGame === 'snake') startSnakeGame();
        if (activeGame === 'invaders') startInvadersGame();
        if (activeGame === 'tictactoe') startTicTacToe();
        setInput('');
        return;
      }

      if (activeGame === 'hack') {
        const guess = parseInt(rawCmd, 10);
        if (isNaN(guess) || guess < 1 || guess > 50) {
          responseOutput = '⚠️ 1 ile 50 arasında kod girin (Çıkış için "exit").';
          responseType = 'error';
        } else if (guess === hackTarget) {
          setActiveGame('menu');
          responseOutput = `🔓 SİSTEM KRİPTOSU KIRILDI! Doğru kod: [${hackTarget}] 🎉`;
          responseType = 'success';
        } else {
          const nextAt = hackAttempts - 1;
          setHackAttempts(nextAt);
          if (nextAt <= 0) {
            setActiveGame('menu');
            responseOutput = `🔒 ERİŞİM ENGELLENDİ! Doğru kod: [${hackTarget}]`;
            responseType = 'error';
          } else {
            const diff = Math.abs(hackTarget - guess);
            const hint = diff <= 3 ? '🔥 ALEV ALIYOR!' : diff <= 8 ? '🌡️ Çok sıcak!' : '❄️ Buz gibi!';
            const dir = guess < hackTarget ? 'YUKARI ⬆️' : 'AŞAĞI ⬇️';
            responseOutput = `${hint} | Yön: ${dir} | Kalan Hak: ${nextAt}`;
            responseType = 'info';
          }
        }
        setHistory((prev) => [...prev, { command: rawCmd, output: responseOutput, type: responseType }]);
        setInput('');
        return;
      }
    }

    if (messageState === 'step_name') {
      setTempMsgData((prev) => ({ ...prev, name: rawCmd }));
      setMessageState('step_email');
      setHistory((prev) => [...prev, { command: rawCmd, output: 'E-posta adresinizi girin:', type: 'info' }]);
      setInput('');
      return;
    }

    if (messageState === 'step_email') {
      setTempMsgData((prev) => ({ ...prev, email: rawCmd }));
      setMessageState('step_msg');
      setHistory((prev) => [...prev, { command: rawCmd, output: 'İletmek istediğiniz mesajı yazın:', type: 'info' }]);
      setInput('');
      return;
    }

    if (messageState === 'step_msg') {
      setMessageState('idle');
      responseOutput = `Teşekkürler ${tempMsgData.name}! Mesajınız başarıyla iletildi.`;
      responseType = 'success';
      setHistory((prev) => [...prev, { command: rawCmd, output: responseOutput, type: responseType }]);
      setInput('');
      return;
    }

    switch (cmd) {
      case 'help':
      case 'yardim':
        responseOutput = (
          <div className="space-y-2 text-xs py-1">
            <div className="text-[#43D9C3] font-bold border-b border-white/10 pb-1">📂 Navigasyon & Sistem</div>
            <div className="grid grid-cols-2 gap-1 text-zinc-300">
              <div><span className="text-[#43D9C3]">about</span> - Hakkımda</div>
              <div><span className="text-[#43D9C3]">skills</span> - Yetenekler</div>
              <div><span className="text-[#43D9C3]">projects</span> - Projeler</div>
              <div><span className="text-[#43D9C3]">contact</span> - İletişim</div>
              <div><span className="text-[#43D9C3]">neofetch</span> - Sistem özeti</div>
              <div><span className="text-[#43D9C3]">stack</span> - Teknoloji mimarisi</div>
            </div>

            <div className="text-[#43D9C3] font-bold border-b border-white/10 pb-1 pt-1">🎮 Arcade Oyun Salonu</div>
            <div className="grid grid-cols-2 gap-1 text-zinc-300">
              <div><span className="text-amber-400">snake</span> - Retro Yılan</div>
              <div><span className="text-amber-400">invaders</span> - Bug Savunması</div>
              <div><span className="text-amber-400">tictactoe</span> - XOX Oyunu</div>
              <div><span className="text-amber-400">hack</span> - Şifre Kırma</div>
            </div>
          </div>
        );
        responseType = 'info';
        break;

      case 'game':
        setActiveGame('menu');
        responseOutput = (
          <div className="space-y-1.5 text-xs py-1">
            <div className="text-[#43D9C3] font-bold">🎮 EMINOS ARCADE - OYUN SEÇİN:</div>
            <div>1. <span className="text-amber-400 font-bold">snake</span> - Retro Yılan Oyunu (Ok Tuşları)</div>
            <div>2. <span className="text-amber-400 font-bold">invaders</span> - Space Bug Invaders (Ok Tuşları + Space)</div>
            <div>3. <span className="text-amber-400 font-bold">tictactoe</span> - XOX vs Bilgisayar (Tıklama)</div>
            <div>4. <span className="text-amber-400 font-bold">hack</span> - Şifre Kırma</div>
            <div className="text-zinc-400 pt-1">Oynamak için oyun adını yazın (örn: <span className="text-[#43D9C3]">tictactoe</span>)</div>
          </div>
        );
        responseType = 'info';
        break;

      case 'snake':
      case 'yilan':
        startSnakeGame();
        setInput('');
        return;

      case 'invaders':
      case 'uzay':
        startInvadersGame();
        setInput('');
        return;

      case 'tictactoe':
      case 'xox':
        startTicTacToe();
        setInput('');
        return;

      case 'hack':
        setActiveGame('hack');
        setHackAttempts(5);
        setHackTarget(Math.floor(Math.random() * 50) + 1);
        responseOutput = '🛡️ Kripto Kırıcı Başlatıldı! 1-50 arası gizli kodu tahmin et. (Çıkış: "exit")';
        responseType = 'info';
        break;

      case 'about':
      case 'hakkimda': {
        const res = navigateToSection('about', 'Hakkımda');
        responseOutput = res.output;
        responseType = res.type;
        break;
      }

      case 'projects':
      case 'projeler': {
        const res = navigateToSection('projects', 'Projeler');
        responseOutput = res.output;
        responseType = res.type;
        break;
      }

      case 'skills':
      case 'yetenekler':
        responseOutput = 'Flutter, .NET, Node.js, React, TypeScript, Firebase, Tailwind CSS, Clean Architecture';
        responseType = 'success';
        break;

      case 'stack':
      case 'mimari':
        responseOutput = 'Mobile: Flutter | Frontend: React & TS | Backend: .NET & Node.js | Cloud: Firebase';
        responseType = 'info';
        break;

      case 'contact':
      case 'iletisim': {
        const res = navigateToSection('contact', 'İletişim');
        responseOutput = res.output;
        responseType = res.type;
        break;
      }

      case 'github':
        window.open('https://github.com/emincelebi', '_blank');
        responseOutput = 'GitHub profiline yönlendiriliyorsunuz: github.com/emincelebi';
        responseType = 'success';
        break;

      case 'neofetch':
        responseOutput = 'OS: EminOS v6.3 | Host: Firebase | Stack: React + Vite + TS';
        responseType = 'ascii';
        break;

      case 'message':
        setMessageState('step_name');
        responseOutput = '✉️ Adınızı girin:';
        responseType = 'info';
        break;

      case 'sudo hire emin':
      case 'sudo hire':
        responseOutput = '🚀 Harika bir karar! Emin ekibinize başarıyla katıldı ve kodlamaya hazır.';
        responseType = 'success';
        break;

      case 'clear':
      case 'temizle':
        setHistory([]);
        setInput('');
        return;

      default:
        responseOutput = `Bilinmeyen komut: "${rawCmd}". Komut listesi için "help" yazın.`;
        responseType = 'error';
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: responseOutput, type: responseType }]);
    setInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (activeGame === 'snake') {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp' && snakeDir !== 'DOWN') setSnakeDir('UP');
        if (e.key === 'ArrowDown' && snakeDir !== 'UP') setSnakeDir('DOWN');
        if (e.key === 'ArrowLeft' && snakeDir !== 'RIGHT') setSnakeDir('LEFT');
        if (e.key === 'ArrowRight' && snakeDir !== 'LEFT') setSnakeDir('RIGHT');
      }
      return;
    }

    if (activeGame === 'invaders') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setShipX((x) => Math.max(0, x - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setShipX((x) => Math.min(GRID_W - 1, x + 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        setBullets((prev) => [...prev, { x: shipX, y: GRID_H - 2 }]);
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_LIST.find((c) => c.startsWith(input.toLowerCase().trim()));
      if (match) setInput(match);
    }
  };

  const renderSnakeBoard = () => {
    const rows = [];
    for (let y = 0; y < GRID_H; y++) {
      let line = '';
      for (let x = 0; x < GRID_W; x++) {
        const isHead = snakePos[0].x === x && snakePos[0].y === y;
        const isBody = snakePos.slice(1).some((seg) => seg.x === x && seg.y === y);
        const isFood = foodPos.x === x && foodPos.y === y;

        if (isHead) line += '◉ ';
        else if (isBody) line += '● ';
        else if (isFood) line += '★ ';
        else line += '· ';
      }
      rows.push(<div key={y} className="leading-none tracking-widest">{line}</div>);
    }
    return rows;
  };

  const renderInvadersBoard = () => {
    const rows = [];
    for (let y = 0; y < GRID_H; y++) {
      let line = '';
      for (let x = 0; x < GRID_W; x++) {
        const isShip = y === GRID_H - 1 && x === shipX;
        const isBullet = bullets.some((b) => b.x === x && b.y === y);
        const isEnemy = enemies.some((e) => e.x === x && e.y === y);

        if (isShip) line += '▲ ';
        else if (isBullet) line += '│ ';
        else if (isEnemy) line += '👾';
        else line += '· ';
      }
      rows.push(<div key={y} className="leading-none tracking-widest">{line}</div>);
    }
    return rows;
  };

  const getContainerStyle = (): React.CSSProperties => {
    if (!isExpanded) {
      return { left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' };
    }
    const shiftX = pos.x > 50 ? '-100%' : '0%';
    const shiftY = pos.y > 50 ? '-100%' : '0%';
    const clampedX = Math.max(3, Math.min(97, pos.x));
    const clampedY = Math.max(15, Math.min(95, pos.y));
    return { left: `${clampedX}%`, top: `${clampedY}%`, transform: `translate(${shiftX}, ${shiftY})` };
  };

  return (
    <div
      style={getContainerStyle()}
      onMouseEnter={() => { setIsHovered(true); setTimeout(() => inputRef.current?.focus(), 200); }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => inputRef.current?.focus()}
      className={`hidden md:flex fixed z-9999 font-mono select-none border backdrop-blur-md ${
        isExpanded
          ? 'transition-all duration-300 ease-out w-[94vw] max-w-2xl h-110 rounded-2xl bg-[#080A0F]/95 border-[#43D9C3]/70 shadow-2xl shadow-[#43D9C3]/25 opacity-100 flex-col'
          : 'transition-[width,height,border-radius,background-color] duration-300 w-12 h-12 rounded-full bg-[#10141D]/90 border-white/10 shadow-lg shadow-black/40 cursor-pointer opacity-85 items-center justify-center overflow-hidden hover:border-[#43D9C3]/50'
      }`}
    >
      {!isExpanded && (
        <div className="flex items-center justify-center text-[#43D9C3] font-bold text-sm tracking-tighter animate-pulse">
          &gt;_
        </div>
      )}

      {isExpanded && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#10141D]/60 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={() => setIsHovered(false)} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-[#43D9C3]/80" />
              <span className="ml-2 text-xs text-[#9299A8]">emin@celebi:~</span>
            </div>
            <span className="text-xs text-[#43D9C3] font-bold">terminal</span>
          </div>

          <div
            ref={terminalBodyRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 text-xs"
          >
            {activeGame === 'snake' && (
              <SnakeGame score={snakeScore} gameOver={snakeGameOver} renderBoard={renderSnakeBoard} />
            )}

            {activeGame === 'invaders' && (
              <InvadersGame score={invadersScore} gameOver={invadersOver} renderBoard={renderInvadersBoard} />
            )}

            {activeGame === 'tictactoe' && (
              <TicTacToeGame board={tttBoard} turn={tttTurn} winner={tttWinner} onCellClick={handleTttCellClick} />
            )}

            {(activeGame === 'menu' || activeGame === 'hack') &&
              history.map((item, idx) => (
                <div key={idx} className="leading-relaxed">
                  <div className="text-[#9299A8] flex items-center gap-1.5">
                    <span className="text-[#43D9C3] font-bold">$</span>
                    <span className="text-zinc-200">{item.command}</span>
                  </div>
                  <div className="mt-1 pl-3 border-l-2 border-[#43D9C3] text-zinc-300">
                    {item.output}
                  </div>
                </div>
              ))}
          </div>

          <div className="px-4 py-2 bg-[#10141D]/40 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap">
            <span className="text-[#9299A8]">Hızlı Seçim:</span>
            {['help', 'game', 'snake', 'invaders', 'tictactoe', 'hack', 'exit', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#43D9C3]/20 hover:text-[#43D9C3] text-zinc-300 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          <form onSubmit={handleFormSubmit} className="p-3 border-t border-white/8 flex items-center bg-[#080A0F] rounded-b-2xl">
            <span className="text-[#43D9C3] mr-2 font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeGame !== 'menu' && activeGame !== 'hack'
                  ? 'Oyun aktif! Kontroller aktif... (Çıkış: exit)'
                  : 'Komut yazın (örn: snake, invaders, tictactoe, game)...'
              }
              className="w-full bg-transparent text-[#F5F7FA] placeholder-[#9299A8] focus:outline-none text-xs font-mono"
            />
          </form>
        </>
      )}
    </div>
  );
};