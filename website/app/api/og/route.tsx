import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSarcasticCommentary } from '@/lib/roast';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get query parameters with defaults
    const tech = searchParams.get('tech') || 'Technology';
    const score = searchParams.get('score') || 'Unknown';

    // Determine color based on score value
    let scoreColor = '#4ade80'; // Default lime green
    let scoreMessage = 'Still breathing! For now...';
    let emoji = '🔥';

    if (score !== 'Unknown') {
      const scoreNum = parseFloat(score);
      if (scoreNum > 80) {
        scoreColor = '#ef4444'; // Red
        scoreMessage = getSarcasticCommentary(scoreNum);
        emoji = '💀';
      } else if (scoreNum > 60) {
        scoreColor = '#f97316'; // Orange
        scoreMessage = getSarcasticCommentary(scoreNum);
        emoji = '🪦';
      } else if (scoreNum > 40) {
        scoreColor = '#facc15'; // Yellow
        scoreMessage = getSarcasticCommentary(scoreNum);
        emoji = '⚰️';
      } else if (scoreNum > 20) {
        scoreColor = '#84cc16'; // Light green
        scoreMessage = getSarcasticCommentary(scoreNum);
        emoji = '🤕';
      } else {
        scoreMessage = getSarcasticCommentary(scoreNum);
        emoji = '💰';
      }
    } else {
      scoreMessage = "So obscure we can't even tell if it's dead";
      emoji = '🤷';
    }

    // Limit scoreMessage length to prevent potential rendering issues
    scoreMessage = scoreMessage.length > 80 ? scoreMessage.substring(0, 80) + '...' : scoreMessage;

    // Generate a limited number of static binary elements for background instead of random ones
    const binaryElements = Array.from({ length: 30 }).map((_, i) => ({
      key: i,
      value: i % 2, // Alternate between 0 and 1
      fontSize: 16 + (i % 8) * 2, // More predictable sizes
      opacity: 0.4 + (i % 10) / 10, // More predictable opacity
      rotation: (i * 30) % 360, // More predictable rotation
      top: `${(i * 3) % 100}%`, // More predictable positions
      left: `${(i * 7) % 100}%`,
    }));

    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(to bottom right, #0f0f0f, #1a1a1a)',
            padding: 40,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Matrix-like background effect with static elements */}
          {binaryElements.map(el => (
            <div
              key={el.key}
              style={{
                position: 'absolute',
                color: '#2e2e2e',
                fontSize: el.fontSize,
                opacity: el.opacity,
                transform: `rotate(${el.rotation}deg)`,
                top: el.top,
                left: el.left,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {el.value}
            </div>
          ))}

          {/* Overlay for better text contrast */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.55)',
              zIndex: 1,
            }}
          />

          {/* Logo watermark - simplified to avoid loading issues */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              opacity: 0.12,
              color: '#333',
              fontSize: '200px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}
          >
            IS THIS TECH DEAD?
          </div>

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              width: '100%',
              padding: 20,
            }}
          >
            {/* Tech name - limit size to prevent overflow issues */}
            <div
              style={{
                fontSize: tech.length > 12 ? 120 : 150,
                fontWeight: 'bold',
                background: `linear-gradient(to right, ${scoreColor}, ${scoreColor === '#ef4444' ? '#ff7b00' : '#3b82f6'})`,
                backgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                marginBottom: 5,
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {tech}
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 'bold',
                color: '#4ade80',
                textAlign: 'center',
                marginBottom: 20,
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
              }}
            >
              is
            </div>

            {/* Score display */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 40px',
                background: 'rgba(20, 20, 20, 0.8)',
                borderRadius: 16,
                border: `2px solid ${scoreColor}`,
                boxShadow: `0 0 20px ${scoreColor}40`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}
              >
                <span style={{ fontSize: 48, marginRight: 15, display: 'flex' }}>{emoji}</span>
                <div
                  style={{
                    fontSize: 80,
                    fontWeight: 'bold',
                    color: scoreColor,
                    display: 'flex',
                  }}
                >
                  {score}
                  {score !== 'Unknown' ? '% dead' : ''}
                </div>
                <span style={{ fontSize: 48, marginLeft: 15, display: 'flex' }}>{emoji}</span>
              </div>

              <div
                style={{
                  fontSize: 32,
                  color: '#ccc',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: '90%',
                }}
              >
                {`"${scoreMessage}"`}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'image/png',
          Pragma: 'no-cache',
        },
      }
    );
  } catch {
    // Extract tech name from the request for the fallback image
    const techName = new URL(req.url).searchParams.get('tech') || 'Technology';

    // Return a simplified fallback image in case of error
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0f0f0f',
            color: '#fff',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>Is This Tech Dead?</h1>
          <p style={{ fontSize: 40 }}>{`${techName} - Deaditude Score`}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'Content-Type': 'image/png',
        },
      }
    );
  }
}
