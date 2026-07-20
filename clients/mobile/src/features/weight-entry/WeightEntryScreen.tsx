import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { ThemeColors } from '../../ui/theme';
import type { Notice, WeightEntryController } from './useWeightEntry';
import { WeightForm } from './WeightForm';

interface WeightEntryScreenProps {
  colors: ThemeColors;
  controller: WeightEntryController;
  disabled: boolean;
  notice: Notice | null;
}

export function WeightEntryScreen({
  colors,
  controller,
  disabled,
  notice,
}: WeightEntryScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.fill}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <WeightForm
            colors={colors}
            disabled={disabled || controller.formDisabled}
            notice={notice}
            submitting={controller.submitting}
            weight={controller.weight}
            weightError={controller.weightError}
            onSubmit={controller.submitWeight}
            onWeightBlur={controller.validateWeight}
            onWeightChange={controller.changeWeight}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    maxWidth: 420,
    paddingHorizontal: 24,
    width: '100%',
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingTop: 12,
  },
});
