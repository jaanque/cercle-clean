import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: '¡Hola! Soy tu asistente de Cercle AI. ✨\n¿En qué puedo ayudarte hoy? Puedo buscar productos en excedente, recomendarte comercios sostenibles cercanos o responder dudas.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = '';
      const query = text.toLowerCase();

      if (query.includes('tienda') || query.includes('comercio') || query.includes('local')) {
        responseText = 'He encontrado varios comercios con excedentes disponibles cerca de ti en Barcelona. Te recomiendo echar un vistazo a "Granel & Co." (a 1.2 km) o "Panadería Bella" (a 0.8 km) con un 5% de reembolso activo.';
      } else if (query.includes('precio') || query.includes('oferta') || query.includes('descuento')) {
        responseText = 'Los precios en CercleApp tienen descuentos de hasta el 50% en excedentes diarios. Puedes añadir los productos directamente a tu carrito de local desde la aplicación para reservarlos.';
      } else if (query.includes('hola') || query.includes('buenos dias') || query.includes('buenas')) {
        responseText = '¡Hola! Qué gusto saludarte. ¿Hay algún producto en particular que estés buscando o te gustaría ver las ofertas de comida de hoy?';
      } else {
        responseText = `Entendido. He registrado tu consulta sobre "${text}". Como tu asistente Cercle AI, te sugiero explorar nuestra sección de tendencias o buscar directamente en la barra de exploración para encontrar excedentes de locales cercanos en tiempo real.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom when messages list changes
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Cercle AI</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Asistente Activo</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Messages Scroll Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            const isAi = item.sender === 'ai';
            return (
              <View
                key={item.id}
                style={[
                  styles.messageRow,
                  isAi ? styles.messageRowAi : styles.messageRowUser,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isAi ? styles.bubbleAi : styles.bubbleUser,
                  ]}
                >
                  <Text style={isAi ? styles.bubbleTextAi : styles.bubbleTextUser}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowAi]}>
              <View style={[styles.messageBubble, styles.bubbleAi, styles.typingBubble]}>
                <ActivityIndicator size="small" color={Colors.accent} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Pregunta a Cercle AI..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                pressed && { opacity: 0.8 },
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <SymbolView name="paperplane.fill" size={14} tintColor="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Sleek clean background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    width: '100%',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22, // rounded strictly to 22px
  },
  bubbleAi: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 6,
  },
  bubbleTextAi: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
  bubbleTextUser: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    fontWeight: '600',
  },
  typingBubble: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 22, // rounded strictly to 22px
    height: 46,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingRight: 8,
  },
  sendBtn: {
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
