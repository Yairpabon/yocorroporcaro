'use strict';
const registrationDialog = document.createElement('dialog');
registrationDialog.id = 'registration-dialog';
registrationDialog.setAttribute('aria-labelledby', 'registration-title');
const field = (label, name, type = 'text', extra = '') => `<label>${label}<input name="${name}" type="${type}" required ${extra}></label>`;
const select = (label, name, options) => `<label>${label}<select name="${name}" required><option value="">Selecciona una opción</option>${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join('')}</select></label>`;
registrationDialog.innerHTML = `
<button class="dialog-close registration-close" type="button" aria-label="Cerrar formulario">×</button>
<div class="registration-layout">
<aside class="registration-intro"><img src="assets/logo-blanco-principal.svg" alt="Yo Corro por Caro"><span class="eyebrow">CADA PASO CUENTA</span><h2 id="registration-title">Tu motivo.<br>Tu carrera.</h2><p>Corre por ti, por ella, por una historia que merece seguir.</p><div class="registration-event"><strong>5K · Santa Marta</strong><span>24 de octubre de 2026</span></div><p class="registration-benefits">Un mismo beneficio para todos. Tú eliges cuánto aportar.</p><span class="registration-heart" aria-hidden="true">♡</span></aside>
<div class="registration-body"><ol class="registration-steps" aria-label="Pasos del formulario"><li aria-current="step">1. Tus datos</li><li>2. Tu aporte</li></ol>
<form id="participant-form">
<div id="participant-step"><h3>Nos vemos en la salida</h3><p class="registration-description">Completa los datos de la persona que participará. Todos los campos son obligatorios salvo el club deportivo.</p>
<fieldset><legend>Datos del participante</legend><div class="registration-fields">
${field('Nombre', 'firstName', 'text', 'autocomplete="given-name" maxlength="60"')}
${field('Apellidos', 'lastName', 'text', 'autocomplete="family-name" maxlength="60"')}
${field('Número de documento', 'documentNumber', 'text', 'inputmode="numeric" maxlength="40" pattern="[0-9]+" title="Ingresa el documento sin puntos ni espacios"')}
${field('Fecha de nacimiento', 'birthDate', 'date')}
<label>Edad<input name="agePreview" readonly placeholder="Se calcula automáticamente"></label>
${select('Género', 'gender', [['female', 'Femenino'], ['male', 'Masculino'], ['other', 'Otro'], ['prefer_not_to_say', 'Prefiero no decirlo']])}
${field('Correo electrónico', 'email', 'email', 'autocomplete="email" maxlength="160"')}
${field('Teléfono', 'phone', 'tel', 'autocomplete="tel" maxlength="30"')}
${select('Talla de camiseta', 'shirtSize', ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => [size, size]))}
${select('Tipo de sangre', 'bloodType', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => [type, type]))}
<label class="registration-wide">Club deportivo <small>Opcional</small><input name="sportsClub" maxlength="120" placeholder="Nombre de tu club"></label>
</div></fieldset><fieldset><legend>En caso de emergencia</legend><div class="registration-fields">${field('Nombre del contacto', 'emergencyContactName', 'text', 'maxlength="120"')}${field('Teléfono del contacto', 'emergencyContactPhone', 'tel', 'maxlength="30"')}</div></fieldset>
<label class="registration-policy"><input name="acceptedDataPolicy" type="checkbox" required> Acepto los términos y el tratamiento de mis datos personales.</label><button class="button registration-next" type="button">Elegir mi aporte <span aria-hidden="true">→</span></button></div>
<div id="contribution-step" hidden><h3>Un aporte con propósito</h3><p class="registration-description">Cada inscripción corresponde a una persona. Todas las opciones incluyen los mismos beneficios.</p>
<fieldset><legend>¿Cómo quieres inscribirte?</legend><div class="registration-modes"><label><input type="radio" name="accessMode" value="payment" checked> Hacer una donación</label><label><input type="radio" name="accessMode" value="coupon"> Tengo un cupón</label></div></fieldset>
<div id="payment-fields"><fieldset><legend>Elige tu aporte</legend><div class="contribution-options"><label><input type="radio" name="contribution" value="30000" checked><span>$30.000<small>Tu aporte suma</small></span></label><label><input type="radio" name="contribution" value="60000"><span>$60.000<small>Corremos con corazón</small></span></label><label><input type="radio" name="contribution" value="custom"><span>Otro valor<small>Mayor de $60.000</small></span></label></div></fieldset><label id="custom-amount-label" hidden>Tu aporte en pesos colombianos<input name="customAmount" type="number" min="60001" step="1" inputmode="numeric" placeholder="Ej. 80000" disabled></label></div>
<div id="coupon-fields" hidden><label>Código de cupón<input name="couponCode" maxlength="80" autocomplete="off" placeholder="Escribe tu código" disabled></label><p class="registration-description">El cupón permite una inscripción gratuita, sujeto a su vigencia y usos disponibles.</p></div>
<div class="registration-summary"><span>Tu participación</span><strong id="participant-summary"></strong><span>Distancia <b>5K</b></span><span id="contribution-summary">Aporte elegido: $30.000</span></div>
<p class="registration-preview-note">El formulario está en preparación. Aún no guarda inscripciones, valida cupones ni realiza cobros.</p>
<div class="registration-actions"><button class="registration-back" type="button">← Volver a mis datos</button><button class="button" type="submit">Revisar mis datos</button></div><p id="registration-feedback" role="status" aria-live="polite"></p></div>
</form></div></div>`;
document.body.append(registrationDialog);
const form = registrationDialog.querySelector('form');
const participantStep = registrationDialog.querySelector('#participant-step');
const contributionStep = registrationDialog.querySelector('#contribution-step');
let previousFocus;
function showStep(second) {
  participantStep.hidden = second;
  contributionStep.hidden = !second;
  registrationDialog.querySelectorAll('.registration-steps li').forEach((item, index) => { if (index === Number(second)) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
  const heading = registrationDialog.querySelector(second ? '#contribution-step h3' : '#participant-step h3');
  heading.tabIndex = -1;
  heading.focus();
  registrationDialog.scrollTop = 0;
}
document.querySelectorAll('[data-register]').forEach(button => button.addEventListener('click', () => {
  if (dialog.open) dialog.close();
  previousFocus = button;
  registrationDialog.showModal();
  document.body.classList.add('dialog-open');
  showStep(!contributionStep.hidden);
}));
registrationDialog.querySelector('.registration-close').addEventListener('click', () => registrationDialog.close());
registrationDialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
const birthDate = form.elements.birthDate;
birthDate.max = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
birthDate.addEventListener('input', () => {
  const [year, month, day] = birthDate.value.split('-').map(Number);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }).split('-').map(Number);
  const age = today[0] - year - Number(today[1] < month || (today[1] === month && today[2] < day));
  birthDate.setCustomValidity(birthDate.value && !(age >= 1 && age <= 120) ? 'Ingresa una fecha de nacimiento válida (edad de 1 a 120 años).' : '');
  form.elements.agePreview.value = birthDate.value && age >= 1 && age <= 120 ? `${age} años` : '';
});
registrationDialog.querySelector('.registration-next').addEventListener('click', () => {
  for (const input of participantStep.querySelectorAll('input, select')) {
    if (input.type === 'text') input.value = input.value.trim();
    if (!input.reportValidity()) return;
  }
  registrationDialog.querySelector('#participant-summary').textContent = `${form.elements.firstName.value} ${form.elements.lastName.value}`;
  showStep(true);
});
registrationDialog.querySelector('.registration-back').addEventListener('click', () => showStep(false));
function updateContribution() {
  const coupon = form.elements.accessMode.value === 'coupon';
  const custom = !coupon && form.elements.contribution.value === 'custom';
  registrationDialog.querySelector('#payment-fields').hidden = coupon;
  registrationDialog.querySelector('#coupon-fields').hidden = !coupon;
  registrationDialog.querySelector('#custom-amount-label').hidden = !custom;
  form.elements.customAmount.disabled = !custom;
  form.elements.customAmount.required = custom;
  form.elements.couponCode.disabled = !coupon;
  form.elements.couponCode.required = coupon;
  const amount = custom ? Number(form.elements.customAmount.value) : Number(form.elements.contribution.value);
  registrationDialog.querySelector('#contribution-summary').textContent = coupon ? 'Inscripción con cupón · sujeto a validación' : custom && !form.elements.customAmount.value ? 'Elige un aporte mayor de $60.000' : `Aporte elegido: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)}`;
  registrationDialog.querySelector('#registration-feedback').textContent = '';
}
form.addEventListener('input', updateContribution);
form.addEventListener('change', updateContribution);
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!contributionStep.hidden) {
    if (form.elements.couponCode.value.trim() === '' && !form.elements.couponCode.disabled) { form.elements.couponCode.value = ''; form.elements.couponCode.reportValidity(); return; }
    registrationDialog.querySelector('#registration-feedback').textContent = 'Datos revisados. Tu inscripción todavía no ha sido enviada. Pronto podrás continuar con el pago o validar tu cupón.';
  } else registrationDialog.querySelector('.registration-next').click();
});

