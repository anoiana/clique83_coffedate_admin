import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Badge, Button } from '../../../shared/components';
import { meetingApi, MeetingLocation, CreateLocationRequest, UpdateLocationRequest } from '../../../features/meeting/api/meetingApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { Plus, Edit2, Trash2, MapPin, Search, X, Image, Save } from 'lucide-react';

const LocationsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { showLoader, hideLoader } = useLoading();
  const [locations, setLocations] = useState<MeetingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MeetingLocation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: '',
    address: '',
    city: '',
    description: '',
    imageUrl: '',
  });

  const fetchLocations = async () => {
    try {
      const data = await meetingApi.getLocations(cityFilter ? { city: cityFilter } : undefined);
      setLocations(data.locations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [cityFilter]);

  const resetForm = () => {
    setFormData({ name: '', address: '', city: '', description: '', imageUrl: '' });
  };

  const openAddModal = () => {
    resetForm();
    setEditingLocation(null);
    setShowAddModal(true);
  };

  const openEditModal = (location: MeetingLocation) => {
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      description: location.description || '',
      imageUrl: location.imageUrl || '',
    });
    setEditingLocation(location);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.city) {
      alert(t('pages.locations.modal.requiredFields'));
      return;
    }

    setActionLoading(true);
    showLoader(editingLocation ? 'loading.updatingLocation' : 'loading.creatingLocation');
    try {
      if (editingLocation) {
        await meetingApi.updateLocation(editingLocation.id, formData as UpdateLocationRequest);
      } else {
        await meetingApi.createLocation(formData);
      }
      setShowAddModal(false);
      resetForm();
      setEditingLocation(null);
      fetchLocations();
    } catch (error) {
      console.error('Failed to save location:', error);
      alert(t('errors.generic'));
    } finally {
      hideLoader();
      setActionLoading(false);
    }
  };

  const handleDelete = async (location: MeetingLocation) => {
    if (!window.confirm(t('common.confirmation.deleteLocation', { name: location.name }))) return;

    setActionLoading(true);
    showLoader('loading.deletingLocation');
    try {
      await meetingApi.deleteLocation(location.id);
      setLocations(prev => prev.filter(l => l.id !== location.id));
    } catch (error) {
      console.error('Failed to delete location:', error);
      alert(t('errors.generic'));
    } finally {
      hideLoader();
      setActionLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('pages.locations.loading')}</div>;
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h1">{t('pages.locations.title')}</Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {t('pages.locations.description')}
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          {t('pages.locations.addButton')}
        </Button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder={t('pages.locations.searchPlaceholder')}
            value={cityFilter}
            onChange={(e) => { setCityFilter(e.target.value); setLoading(true); }}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px dashed var(--border)',
        }}>
          <MapPin size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h2" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {t('pages.locations.noLocations')}
          </Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {cityFilter ? t('pages.locations.noMatchFilter') : t('pages.locations.addFirstPrompt')}
          </Typography>
          {!cityFilter && (
            <Button variant="primary" onClick={openAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} />
              {t('pages.locations.addFirstButton')}
            </Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {locations.map(location => (
            <Card key={location.id} style={{ overflow: 'hidden', padding: 0 }}>
              {/* Image */}
              <div style={{
                height: '160px',
                backgroundColor: 'var(--border)',
                backgroundImage: location.imageUrl ? `url(${location.imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                {!location.imageUrl && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <MapPin size={40} color="var(--text-secondary)" />
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{t('pages.locations.noImage')}</Typography>
                  </div>
                )}
                {/* City Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <Badge variant="info" style={{ fontSize: '11px' }}>{location.city}</Badge>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <Typography variant="h2" style={{ marginBottom: '8px', fontSize: '18px' }}>{location.name}</Typography>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={14} color="var(--text-secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <Typography variant="body" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {location.address}
                  </Typography>
                </div>
                {location.description && (
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5', display: 'block', marginBottom: '16px' }}>
                    {location.description}
                  </Typography>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Button
                    variant="secondary"
                    onClick={() => openEditModal(location)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
                  >
                    <Edit2 size={14} />
                    {t('pages.locations.editButton')}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(location)}
                    style={{ padding: '8px 12px' }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            margin: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Typography variant="h2">
                {editingLocation ? t('pages.locations.modal.titleEdit') : t('pages.locations.modal.titleAdd')}
              </Typography>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Typography variant="caption" style={{ fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  {t('pages.locations.modal.nameLabel')}
                </Typography>
                <input
                  type="text"
                  placeholder={t('placeholders.exampleName')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <Typography variant="caption" style={{ fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  {t('pages.locations.modal.addressLabel')}
                </Typography>
                <input
                  type="text"
                  placeholder={t('placeholders.exampleAddress')}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <Typography variant="caption" style={{ fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  {t('pages.locations.modal.cityLabel')}
                </Typography>
                <input
                  type="text"
                  placeholder={t('placeholders.exampleCity')}
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <Typography variant="caption" style={{ fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  {t('pages.locations.modal.descriptionLabel')}
                </Typography>
                <textarea
                  placeholder={t('placeholders.exampleDescription')}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <Typography variant="caption" style={{ fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  {t('pages.locations.modal.imageUrlLabel')}
                </Typography>
                <div style={{ position: 'relative' }}>
                  <Image size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder={t('placeholders.exampleImageUrl')}
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }} style={{ flex: 1 }}>
                {t('pages.locations.modal.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={actionLoading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Save size={16} />
                {editingLocation ? t('pages.locations.modal.update') : t('pages.locations.modal.create')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
