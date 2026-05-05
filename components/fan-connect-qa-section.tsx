/**
 * Fan Connect Q&A Section
 * 
 * Displays Q&A items with option to submit questions.
 */

'use client';

import { useState } from 'react';
import { QAItem } from '@/types/creator-profile';
import { QAItemComponent } from '@/components/qa-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquarePlus, Send } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface FanConnectQASectionProps {
  items: QAItem[];
  showAddQuestion: boolean;
  onAddQuestion?: (question: string) => void;
}

/**
 * Fan Connect Q&A section component
 * 
 * @param items - Array of Q&A items
 * @param showAddQuestion - Whether to show "Ask Question" button
 * @param onAddQuestion - Callback when question is submitted
 */
export function FanConnectQASection({ 
  items, 
  showAddQuestion, 
  onAddQuestion 
}: FanConnectQASectionProps) {
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState('');
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  
  const handleSubmit = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (question.trim() && onAddQuestion) {
      onAddQuestion(question.trim());
      setQuestion('');
      setIsAsking(false);
    }
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="px-4 py-6 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" style={{ color: 'var(--profile-primary)' }} />
          Fan Connect
        </h2>
        {showAddQuestion && !isAsking && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAsking(true)}
          >
            Ask Question
          </Button>
        )}
      </div>
      
      {/* Ask Question Form */}
      {isAsking && (
        <div className="space-y-2 p-4 border rounded-lg">
          <Input
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            maxLength={500}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!question.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAsking(false);
                setQuestion('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Q&A Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <QAItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
