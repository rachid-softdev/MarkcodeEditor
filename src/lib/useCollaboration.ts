'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface Collaborator {
  id: string;
  userId: string;
  email: string;
  name: string;
  cursor?: { line: number; column: number };
  color: string;
}

interface UseCollaborationOptions {
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  onContentChange?: (content: string) => void;
}

const COLLABORATOR_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
  '#f43f5e',
];

export function useCollaboration({
  documentId,
  userId,
  userName,
  userEmail,
  onContentChange,
}: UseCollaborationOptions) {
  const [supabase] = useState(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )
  );
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const getColor = useCallback(() => {
    const index = userId.charCodeAt(0) % COLLABORATOR_COLORS.length;
    return COLLABORATOR_COLORS[index];
  }, [userId]);

  useEffect(() => {
    if (!documentId) return;

    const channel = supabase
      .channel(`document:${documentId}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'UPDATE' && payload.new?.content) {
            onContentChange?.(payload.new.content);
          }
        }
      )
      .on(
        'broadcast' as any,
        { event: 'cursor' },
        ({ payload }: { payload: any }) => {
          setCollaborators((prev) =>
            prev.map((c) =>
              c.userId === payload?.userId
                ? { ...c, cursor: payload?.cursor }
                : c
            )
          );
        }
      )
      .on(
        'broadcast' as any,
        { event: 'presence' },
        ({ payload }: { payload: any }) => {
          setCollaborators(payload?.collaborators || []);
        }
      )
      .subscribe((status: any) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);

          channel.track({
            userId,
            userName,
            userEmail,
            color: getColor(),
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [documentId, userId, userName, userEmail, supabase, getColor, onContentChange]);

  const sendCursorPosition = useCallback(
    (line: number, column: number) => {
      supabase.channel(`document:${documentId}`).send({
        type: 'broadcast' as any,
        event: 'cursor',
        payload: { userId, cursor: { line, column } },
      });
    },
    [documentId, supabase, userId]
  );

  const broadcastChange = useCallback(
    (content: string) => {
      supabase.channel(`document:${documentId}`).send({
        type: 'broadcast' as any,
        event: 'content',
        payload: { userId, content },
      });
    },
    [documentId, supabase, userId]
  );

  return {
    collaborators,
    isConnected,
    sendCursorPosition,
    broadcastChange,
  };
}